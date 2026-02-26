package com.example.chat_service.service;




import com.example.chat_service.model.ChatContext;
import com.example.chat_service.model.ChatIntent;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ContextService {

    private final Map<String, ChatContext> store = new ConcurrentHashMap<>();

    public ChatContext get(String userId) {
        return store.computeIfAbsent(userId, k -> new ChatContext());
    }

    public void updateContext(String userId, ChatIntent intent) {
        get(userId).setLastIntent(intent);
    }
}
