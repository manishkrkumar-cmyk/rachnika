package com.rachnika.backend.service;

import com.rachnika.backend.dto.request.ProductRequest;
import com.rachnika.backend.entity.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    List<Product> searchProducts(String query);
    List<Product> getProductsByCategory(Long categoryId);
    Product createProduct(ProductRequest request);
    Product updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}