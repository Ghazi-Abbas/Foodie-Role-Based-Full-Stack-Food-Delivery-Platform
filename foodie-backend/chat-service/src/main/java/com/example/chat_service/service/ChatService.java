package com.example.chat_service.service;


import com.example.chat_service.model.ChatRequest;
import com.example.chat_service.model.ChatResponse;

public interface ChatService {

    ChatResponse process(ChatRequest request, String authHeader);
}
