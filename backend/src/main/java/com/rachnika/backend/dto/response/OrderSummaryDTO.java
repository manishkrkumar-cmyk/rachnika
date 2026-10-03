package com.rachnika.backend.dto.response;

import com.rachnika.backend.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryDTO {
    private Long id;
    private String orderNumber;
    private Double totalAmount;
    private OrderStatus orderStatus;
    private Integer totalItems;
    private LocalDateTime createdAt;
}