package com.example.chat_service.util;

import com.example.chat_service.model.ChatResponse;

import java.util.List;
import java.util.Map;

public class ResponseBuilder {

    // -------- TEXT RESPONSE --------
    public static ChatResponse text(String msg) {
        return new ChatResponse("text", msg);
    }

    // -------- CARD RESPONSE --------
    public static ChatResponse cards(String title, List<Map<String, Object>> data) {
        return new ChatResponse("cards", title, data);
    }

    // -------- MENU RESPONSE --------
    public static ChatResponse menu(String title, List<Map<String, String>> menu) {
        return new ChatResponse("menu", title, (List) menu);
    }

    // -------- ERROR RESPONSE --------
    public static ChatResponse error(String msg) {
        return new ChatResponse("error", msg);
    }
}
