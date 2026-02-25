package foodie_auth_service.foodie_auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // =========================================================
    // 1️⃣ SIGNUP OTP EMAIL
    // =========================================================
    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP for Foodie App");
        message.setText(
                "Hello,\n\n" +
                        "Your OTP for Foodie signup is: " + otp + "\n\n" +
                        "This OTP will expire in 10 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "— Foodie Team"
        );

        mailSender.send(message);
    }

    // =========================================================
    // 2️⃣ SIGNUP SUCCESS EMAIL (AFTER COMPLETE SIGNUP)
    // =========================================================
    public void sendSignupSuccessEmail(String email, String name) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to Foodie 🎉");

        message.setText(
                "Hi " + name + ",\n\n" +
                        "🎉 Your Foodie account has been created successfully!\n\n" +
                        "You can now log in and start ordering delicious food 🍔🍕\n\n" +
                        "If this was not you, please contact support immediately.\n\n" +
                        "— Foodie Team"
        );

        mailSender.send(message);
    }

    // =========================================================
    // 3️⃣ FORGOT PASSWORD EMAIL
    // =========================================================
    public void sendForgotPasswordEmail(
            String toEmail,
            String otp,
            String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset Your Foodie Password");

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your Foodie password.\n\n" +
                        "OTP: " + otp + "\n\n" +
                        "Reset password link:\n" + resetLink + "\n\n" +
                        "This OTP and link will expire in 10 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "— Foodie Team"
        );

        mailSender.send(message);
    }

    // =========================================================
    // 4️⃣ LOGIN ALERT EMAIL (OPTIONAL & SAFE)
    // =========================================================
    public void sendLoginAlert(
            String email,
            String ip,
            String userAgent,
            Double lat,
            Double lon,
            String city,
            String country,
            String isp
    ) {

        String mapUrl = "https://www.google.com/maps?q=" + lat + "," + lon;

        String message = """
    🚨 New Login Detected

    Account: %s
    IP Address: %s
    Device: %s
    ISP: %s
    City: %s
    Country: %s
    Location: %s

    If this wasn't you, please change your password immediately.
    """.formatted(email, ip, userAgent, isp, city, country, mapUrl);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("Security Alert – New Login");
        mail.setText(message);

        mailSender.send(mail);
    }

}
