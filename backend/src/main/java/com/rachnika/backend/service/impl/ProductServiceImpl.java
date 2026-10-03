package com.rachnika.backend.service.impl;

import com.rachnika.backend.dto.request.ProductRequest;
import com.rachnika.backend.entity.Category;
import com.rachnika.backend.entity.Product;
import com.rachnika.backend.entity.User;
import com.rachnika.backend.exception.ResourceNotFoundException;
import com.rachnika.backend.repository.CategoryRepository;
import com.rachnika.backend.repository.ProductRepository;
import com.rachnika.backend.repository.UserRepository;
import com.rachnika.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.searchProducts(query);
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public Product createProduct(ProductRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        User seller = null;
        if (request.getSellerId() != null) {
            seller = userRepository.findById(request.getSellerId()).orElse(null);
        }

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice())
                .discount(request.getDiscount() != null ? request.getDiscount() : 0)
                .rating(4.2)
                .reviewsCount(12)
                .imageUrl(request.getImageUrl())
                .stock(request.getStock())
                .category(category)
                .seller(seller)
                .createdAt(LocalDateTime.now())
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setDiscount(request.getDiscount());
        product.setImageUrl(request.getImageUrl());
        product.setStock(request.getStock());
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}