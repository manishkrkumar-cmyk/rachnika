package com.rachnika.backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // In-memory store for OTPs (phone -> otp)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public String generateAndSendOtp(String phone) {
        String cleanPhone = phone.replaceAll("\\D", "");

        // Generate 6-digit random code
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(cleanPhone, otp);

        // Logs to terminal for instant copy/paste and testing
        System.out.println("=================================================");
        System.out.println("📱 [RACHNIKA SMS GATEWAY] Dispatched to +91 " + cleanPhone);
        System.out.println("🔑 Verification OTP: " + otp);
        System.out.println("=================================================");

        return otp;
    }

    public boolean verifyOtp(String phone, String enteredOtp) {
        if (enteredOtp == null)
            return false;
        String cleanPhone = phone.replaceAll("\\D", "");
        String storedOtp = otpStorage.get(cleanPhone);

        // Allows standard demo code '170489' or the generated code
        if ("170489".equals(enteredOtp.trim()) || (storedOtp != null && storedOtp.equals(enteredOtp.trim()))) {
            otpStorage.remove(cleanPhone);
            return true;
        }
        return false;
    }
}