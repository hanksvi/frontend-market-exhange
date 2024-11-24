package com.dbp.proyectobackendmarketexchange.item.dto;

import com.dbp.proyectobackendmarketexchange.item.domain.Condition;
import com.dbp.proyectobackendmarketexchange.item.domain.Status;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;

@Getter
@Setter
public class ItemResponseDto {
    private Long id;

    private String name;

    private String description;

    private String categoryName;

    private Condition condition;

    private String userName;

    private LocalDateTime createdAt;

    private Status status;

    private String imageUrl;

    private Long user_id;


}
