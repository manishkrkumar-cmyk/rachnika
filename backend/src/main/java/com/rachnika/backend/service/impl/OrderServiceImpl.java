package com.rachnika.backend.service.impl;

import com.rachnika.backend.dto.request.OrderRequest;
import com.rachnika.backend.entity.*;
import com.rachnika.backend.enums.OrderStatus;
import com.rachnika.backend.exception.BadRequestException;
import com.rachnika.backend.exception.ResourceNotFoundException;
import com.rachnika.backend.repository.OrderRepository;
import com.rachnika.backend.repository.ProductRepository;
import com.rachnika.backend.repository.UserRepository;
import com.rachnika.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public Order createOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Address address = Address.builder()
                .fullName(request.getShippingAddress().getFullName())
                .phone(request.getShippingAddress().getPhone())
                .streetAddress(request.getShippingAddress().getStreetAddress())
                .city(request.getShippingAddress().getCity())
                .state(request.getShippingAddress().getState())
                .pincode(request.getShippingAddress().getPincode())
                .build();

        Order order = Order.builder()
                .orderNumber("OD" + UUID.randomUUID().toString().substring(0, 10).toUpperCase())
                .user(user)
                .totalAmount(request.getTotalAmount())
                .orderStatus(OrderStatus.PLACED)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(address)
                .createdAt(LocalDateTime.now())
                .orderItems(new ArrayList<>())
                .build();

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getTitle());
            }

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(itemReq.getPrice())
                    .build();

            order.getOrderItems().add(item);
        }

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }
}