package com.rachnika.backend;

import com.rachnika.backend.entity.Category;
import com.rachnika.backend.entity.User;
import com.rachnika.backend.enums.Role;
import com.rachnika.backend.repository.CategoryRepository;
import com.rachnika.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    /**
     * Seeds ONLY categories and a default seller profile.
     * All products must be added exclusively by sellers through the website UI.
     */
    @Bean
    public CommandLineRunner initData(CategoryRepository categoryRepository,
                                     UserRepository userRepository,
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed a default seller if not already present
            if (userRepository.count() == 0) {
                User demoSeller = User.builder()
                        .name("Rachnika Retail")
                        .email("seller@rachnika.com")
                        .password(passwordEncoder.encode("rachnika123"))
                        .phone("9876543210")
                        .role(Role.ROLE_SELLER)
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(demoSeller);
            }

            // Seed initial categories so the seller dropdown has options
            if (categoryRepository.count() == 0) {
                categoryRepository.save(Category.builder().name("Electronics").build());
                categoryRepository.save(Category.builder().name("Mobiles").build());
                categoryRepository.save(Category.builder().name("Fashion").build());
                categoryRepository.save(Category.builder().name("Home & Furniture").build());
                categoryRepository.save(Category.builder().name("Beauty & Personal Care").build());
            }
        };
    }
}