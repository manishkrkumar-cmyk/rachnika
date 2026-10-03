package com.rachnika.backend.dto.request;

import com.rachnika.backend.enums.PaymentMethod;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
    private Double totalAmount;
    private PaymentMethod paymentMethod;
    private AddressRequest shippingAddress;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private Double price;
    }

    @Data
    public static class AddressRequest {
        private String fullName;
        private String phone;
        private String streetAddress;
        private String city;
        private String state;
        private String pincode;
    }
}