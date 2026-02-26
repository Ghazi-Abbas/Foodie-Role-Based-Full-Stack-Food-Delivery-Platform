package com.example.chat_service.controller;

import com.example.chat_service.model.ChatRequest;
import com.example.chat_service.model.ChatResponse;
import com.example.chat_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(
            @RequestBody ChatRequest request,
            @RequestHeader(value = "Authorization", required = false)
            String authHeader
    ) {
        return chatService.process(request, authHeader);
    }
}
