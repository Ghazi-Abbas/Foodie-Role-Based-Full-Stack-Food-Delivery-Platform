package com.example.chat_service.model;

import java.util.List;
import java.util.Map;

public class ChatResponse {

    private String type;   // text | menu | cards | error
    private String reply;
    private List<Map<String, Object>> data;

    // ========= CONSTRUCTORS =========

    public ChatResponse() {
    }

    public ChatResponse(String type, String reply) {
        this.type = type;
        this.reply = reply;
    }

    public ChatResponse(String type, String reply, List<Map<String, Object>> data) {
        this.type = type;
        this.reply = reply;
        this.data = data;
    }

    // ========= GETTERS =========

    public String getType() {
        return type;
    }

    public String getReply() {
        return reply;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    // ========= SETTERS =========

    public void setType(String type) {
        this.type = type;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }
}
