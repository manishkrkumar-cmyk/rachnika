package com.rachnika.backend.repository;

import com.rachnika.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Category and Seller filters ordered by latest additions
    List<Product> findByCategoryIdOrderByIdDesc(Long categoryId);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findBySellerIdOrderByIdDesc(Long sellerId);

    List<Product> findBySellerId(Long sellerId);

    // Direct derived query for searching by title alone (case-insensitive)
    List<Product> findByTitleContainingIgnoreCase(String title);

    // Full search across title and description (case-insensitive, trims query,
    // handles null)
    @Query("SELECT p FROM Product p WHERE " +
            "(:query IS NULL OR TRIM(:query) = '' OR " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', TRIM(:query), '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))) " +
            "ORDER BY p.id DESC")
    List<Product> searchProducts(@Param("query") String query);

    // Search scoped within a specific craft category
    @Query("SELECT p FROM Product p WHERE " +
            "p.category.id = :categoryId AND " +
            "(:query IS NULL OR TRIM(:query) = '' OR " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', TRIM(:query), '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))) " +
            "ORDER BY p.id DESC")
    List<Product> searchByCategoryAndQuery(@Param("categoryId") Long categoryId,
            @Param("query") String query);
}