package com.rachnika.backend.controller;

import com.rachnika.backend.dto.request.OrderRequest;
import com.rachnika.backend.dto.response.ApiResponse;
import com.rachnika.backend.entity.Order;
import com.rachnika.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", orderService.createOrder(request)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User orders fetched", orderService.getOrdersByUser(userId)));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Order details fetched", orderService.getOrderByOrderNumber(orderNumber)));
    }
}