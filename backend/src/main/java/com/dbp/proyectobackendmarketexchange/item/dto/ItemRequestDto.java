package com.dbp.proyectobackendmarketexchange.item.dto;

import com.dbp.proyectobackendmarketexchange.item.domain.Condition;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.web.multipart.MultipartFile;


import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Getter
@Setter
public class ItemRequestDto {
    @NotBlank(message = "El nombre no puede estar vacio")
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private Long category_id;

    @NotNull
    private Long user_id;

    @NotNull
    private Condition condition;


    private MultipartFile image;


}
