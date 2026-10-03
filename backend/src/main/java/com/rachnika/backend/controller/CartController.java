package com.rachnika.backend.controller;

import com.rachnika.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Object>>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("Cart retrieved (stored client-side or DB synced)", Collections.emptyList()));
    }
}