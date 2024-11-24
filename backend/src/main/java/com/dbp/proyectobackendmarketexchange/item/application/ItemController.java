package com.dbp.proyectobackendmarketexchange.item.application;


import com.dbp.proyectobackendmarketexchange.exception.ResourceNotFoundException;
import com.dbp.proyectobackendmarketexchange.item.domain.Item;
import com.dbp.proyectobackendmarketexchange.item.domain.ItemService;
import com.dbp.proyectobackendmarketexchange.item.dto.ItemRequestDto;
import com.dbp.proyectobackendmarketexchange.item.dto.ItemResponseDto;
import com.dbp.proyectobackendmarketexchange.item.infrastructure.ItemRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/item")
public class ItemController {
    private final ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponseDto> createItem(@ModelAttribute ItemRequestDto requestDto) {

        ItemResponseDto responseDto = itemService.createItem(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // Endpoint para devolver imágenes
    @GetMapping("/{itemId}/image    ")
    public ResponseEntity<byte[]> getImage(@PathVariable Long itemId) {
        // Busca el ítem en la base de datos
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Ítem no encontrado"));

        if (item.getImage() == null || item.getImage().length == 0) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no hay imagen
        }

        // Detectar el tipo MIME de la imagen usando Apache Tika
        Tika tika = new Tika();
        String mimeType = tika.detect(item.getImage());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .body(item.getImage());
    }



    @PostMapping("/{itemId}/approve")
    public ResponseEntity<ItemResponseDto> approveItem(@PathVariable Long itemId, @RequestParam boolean approve) {
        ItemResponseDto responseDto = itemService.approveItem(itemId, approve);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItemResponseDto> updateItem(@PathVariable Long itemId, @RequestBody ItemRequestDto requestDto) {
        ItemResponseDto updateItem = itemService.updateItem(itemId, requestDto);
        return ResponseEntity.ok(updateItem);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemResponseDto> getItem(@PathVariable Long itemId) {
        ItemResponseDto item = itemService.getItemById(itemId);
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDto>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ItemResponseDto> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ItemResponseDto>> getItemByCategory(@PathVariable Long categoryId) {
        List<ItemResponseDto> items = itemService.getItemsByCategory(categoryId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ItemResponseDto>> getItemByUserId(@PathVariable Long userId) {
        List<ItemResponseDto> items = itemService.getItemsByUser(userId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ItemResponseDto>> getUserItems() {
        List<ItemResponseDto> items = itemService.getUserItems();
        return ResponseEntity.ok(items);
    }
}
