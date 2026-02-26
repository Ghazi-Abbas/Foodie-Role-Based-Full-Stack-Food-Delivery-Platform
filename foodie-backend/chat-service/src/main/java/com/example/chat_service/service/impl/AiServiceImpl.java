package com.example.chat_service.service.impl;




import com.example.chat_service.service.AiService;
import org.springframework.stereotype.Service;

@Service
public class AiServiceImpl implements AiService {

    @Override
    public String generateReply(String userMessage) {

        // Placeholder (safe default)
        return "🤖 I’m still learning. Please try one of the options above.";
    }
}
