package com.rachnika.backend.controller;

import com.rachnika.backend.dto.request.ProductRequest;
import com.rachnika.backend.dto.response.ApiResponse;
import com.rachnika.backend.entity.Product;
import com.rachnika.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class ProductController {

    private final ProductService productService;

    /**
     * Fetch all active handcrafted products
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.ok("Products fetched", productService.getAllProducts()));
    }

    /**
     * Fetch craft by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Product found", productService.getProductById(id)));
    }

    /**
     * Search crafts by title, keyword, or within a specific category
     * Supports:
     * /api/products/search?query=...
     * /api/products/search?title=...
     * /api/products/search?query=...&categoryId=...
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Product>>> searchProducts(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "categoryId", required = false) Long categoryId) {

        String searchTerm = (query != null && !query.trim().isEmpty())
                ? query.trim()
                : (title != null && !title.trim().isEmpty() ? title.trim() : null);

        List<Product> results;

        if (searchTerm != null) {
            results = productService.searchProducts(searchTerm);
            // If categoryId is also supplied, filter the search results in-memory
            // avoiding undefined method errors in ProductService
            if (categoryId != null && categoryId > 0) {
                results = results.stream()
                        .filter(p -> p.getCategory() != null && categoryId.equals(p.getCategory().getId()))
                        .collect(Collectors.toList());
            }
        } else if (categoryId != null && categoryId > 0) {
            results = productService.getProductsByCategory(categoryId);
        } else {
            results = productService.getAllProducts();
        }

        return ResponseEntity.ok(ApiResponse.ok(
                String.format("Found %d matching crafts", results.size()),
                results));
    }

    /**
     * Fetch crafts by Category ID
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<Product>>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity
                .ok(ApiResponse.ok("Category products fetched", productService.getProductsByCategory(categoryId)));
    }

    /**
     * Fetch curated / featured crafts for the storefront showcase
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts() {
        List<Product> allProducts = productService.getAllProducts();
        List<Product> featured = allProducts.stream()
                .limit(8)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Featured crafts fetched", featured));
    }

    /**
     * Publish craft via Seller Studio
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Product created", productService.createProduct(request)));
    }

    /**
     * Update craft listing
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.updateProduct(id, request)));
    }

    /**
     * Remove craft listing
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }
}