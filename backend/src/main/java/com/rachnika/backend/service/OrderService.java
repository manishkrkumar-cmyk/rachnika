package com.rachnika.backend.service;

import com.rachnika.backend.dto.request.OrderRequest;
import com.rachnika.backend.entity.Order;
import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getOrdersByUser(Long userId);
    Order getOrderByOrderNumber(String orderNumber);
}