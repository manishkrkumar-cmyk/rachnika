package com.rachnika.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    private Double originalPrice;
    private Integer discount;
    private String imageUrl;

    @NotNull(message = "Stock is required")
    private Integer stock;

    private Long categoryId;
    private Long sellerId;
}