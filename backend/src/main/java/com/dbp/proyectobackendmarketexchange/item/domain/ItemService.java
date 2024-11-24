package com.dbp.proyectobackendmarketexchange.item.domain;


import com.dbp.proyectobackendmarketexchange.auth.utils.AuthorizationUtils;
import com.dbp.proyectobackendmarketexchange.category.domain.Category;
import com.dbp.proyectobackendmarketexchange.category.infrastructure.CategoryRepository;
import com.dbp.proyectobackendmarketexchange.event.item.ItemCreatedEvent;
import com.dbp.proyectobackendmarketexchange.exception.ResourceNotFoundException;
import com.dbp.proyectobackendmarketexchange.exception.UnauthorizeOperationException;
import com.dbp.proyectobackendmarketexchange.item.dto.ItemRequestDto;
import com.dbp.proyectobackendmarketexchange.item.dto.ItemResponseDto;
import com.dbp.proyectobackendmarketexchange.item.infrastructure.ItemRepository;
import com.dbp.proyectobackendmarketexchange.usuario.domain.Usuario;
import com.dbp.proyectobackendmarketexchange.usuario.infrastructure.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UsuarioRepository usuarioRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final AuthorizationUtils authorizationUtils;
    private final ModelMapper modelMapper;

    @Autowired
    public ItemService(ModelMapper modelMapper, ApplicationEventPublisher eventPublisher, ItemRepository itemRepository, CategoryRepository categoryRepository, UsuarioRepository usuarioRepository, AuthorizationUtils authorizationUtils) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.usuarioRepository = usuarioRepository;
        this.authorizationUtils = authorizationUtils;
        this.eventPublisher = eventPublisher;
        this.modelMapper = modelMapper;
    }

    public ItemResponseDto createItem(ItemRequestDto itemDto) {
        // Obtener el usuario autenticado
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            throw new UnauthorizeOperationException("Usuario no autenticado");
        }

        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Buscar la categoría
        Category category = categoryRepository.findById(itemDto.getCategory_id())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        // Mapear el DTO a la entidad Item
        Item item = modelMapper.map(itemDto, Item.class);
        item.setCategory(category);
        item.setUsuario(user);
        item.setStatus(Status.PENDING);

        if (itemDto.getImage() != null && !itemDto.getImage().isEmpty()) {
            try {
                item.setImage(itemDto.getImage().getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Error al procesar la imagen", e);
            }
        }

        // Guardar el ítem
        Item savedItem = itemRepository.save(item);

        // Mapear a Response DTO
        ItemResponseDto responseDto = modelMapper.map(savedItem, ItemResponseDto.class);
        responseDto.setUserName(user.getEmail());
        responseDto.setCategoryName(category.getName());

        // Establecer la URL de la imagen
        if (savedItem.getImage() != null && savedItem.getImage().length > 0) {
            responseDto.setImageUrl("/item/" + savedItem.getId() + "/image"); // Asegúrate de que la ruta coincida con tu endpoint
        }

        return responseDto;
    }


    // Metodo para que el administrador apruebe o rechace el ítem
    public ItemResponseDto approveItem(Long itemId, Boolean approve) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (approve) {
            item.setStatus(Status.APPROVED); // Aprobar el ítem
        } else {
            item.setStatus(Status.REJECTED); // Rechazar el ítem
        }

        itemRepository.save(item);

        return modelMapper.map(item, ItemResponseDto.class);
    }

    public ItemResponseDto updateItem(Long itemId, ItemRequestDto itemRequestDto) {

        Item existingItem = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));


        Category category = categoryRepository.findById(itemRequestDto.getCategory_id())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        Usuario usuario = usuarioRepository.findById(itemRequestDto.getUser_id())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!authorizationUtils.isAdminOrResourceOwner(existingItem.getUsuario().getId())) {
            throw new UnauthorizeOperationException("You do not have permission to update this item.");
        }

        modelMapper.map(itemRequestDto, existingItem);

        // Establecer manualmente la categoría y el usuario si no están en el DTO
        existingItem.setCategory(category);
        existingItem.setUsuario(usuario);

        Item updatedItem = itemRepository.save(existingItem);

        ItemResponseDto responseDto= modelMapper.map(updatedItem, ItemResponseDto.class);

        responseDto.setUserName(updatedItem.getUsuario().getEmail());
        responseDto.setCategoryName(updatedItem.getCategory().getName());

        return responseDto;
    }

    public ItemResponseDto getItemById(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));


        ItemResponseDto responseDto= modelMapper.map(item, ItemResponseDto.class);


        responseDto.setUserName(item.getUsuario().getEmail());
        responseDto.setCategoryName(item.getCategory().getName());
        responseDto.setImageUrl("/item" + item.getId() + "/image");

        return responseDto;
    }

    public void deleteItem(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!authorizationUtils.isAdminOrResourceOwner(item.getUsuario().getId())) {
            throw new UnauthorizeOperationException("You do not have permission to delete this item.");
        }

        itemRepository.delete(item);
    }

    public List<ItemResponseDto> getAllItems() {
        List<Item> items = itemRepository.findAll();

        // Mapear cada Item a ItemResponseDto con atributos adicionales
        return items.stream()
                .map(item -> {
                    ItemResponseDto responseDto = modelMapper.map(item, ItemResponseDto.class);
                    responseDto.setCategoryName(item.getCategory().getName());  // Seteamos el nombre de la categoría
                    responseDto.setUserName(item.getUsuario().getEmail());  // Seteamos el nombre (o email) del usuari
                    responseDto.setImageUrl("/item" + item.getId() + "/image");
                    return responseDto;
                })
                .collect(Collectors.toList());
    }

    public List<ItemResponseDto> getItemsByCategory(Long categoryId) {
        List<Item> items = itemRepository.findByCategoryId(categoryId);



        return items.stream()
                .map(item -> {
                    ItemResponseDto responseDto = modelMapper.map(item, ItemResponseDto.class);
                    responseDto.setCategoryName(item.getCategory().getName());  // Seteamos el nombre de la categoría
                    responseDto.setUserName(item.getUsuario().getEmail());
                    if (item.getImage() != null && item.getImage().length > 0) {
                        responseDto.setImageUrl("/item" + item.getId() + "/image");
                    }// Seteamos el nombre (o email) del usuario

                    return responseDto;
                })
                .collect(Collectors.toList());
    }

    public List<ItemResponseDto> getItemsByUser(Long userId) {
        List<Item> items = itemRepository.findByUsuarioId(userId);

        return items.stream()
                .map(item -> {
                    ItemResponseDto responseDto = modelMapper.map(item, ItemResponseDto.class);
                    responseDto.setCategoryName(item.getCategory().getName());  // Seteamos el nombre de la categoría
                    responseDto.setUserName(item.getUsuario().getEmail());  // Seteamos el nombre (o email) del usuario
                    responseDto.setImageUrl("/item" + item.getId() + "/image");
                    return responseDto;
                })
                .collect(Collectors.toList());
    }

    public List<ItemResponseDto> getUserItems() {
        // Obtener el email del usuario autenticado usando Spring Security
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            throw new UnauthorizeOperationException("Usuario no autenticado");
        }

        // Buscar el usuario por su email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Obtener los ítems del usuario autenticado
        List<Item> items = itemRepository.findByUsuarioId(usuario.getId());

        // Mapear los ítems a ItemResponseDto
        return items.stream()
                .map(item -> {
                    ItemResponseDto responseDto = modelMapper.map(item, ItemResponseDto.class);
                    responseDto.setCategoryName(item.getCategory().getName());
                    responseDto.setUserName(item.getUsuario().getEmail());
                    return responseDto;
                })
                .collect(Collectors.toList());
    }

}
