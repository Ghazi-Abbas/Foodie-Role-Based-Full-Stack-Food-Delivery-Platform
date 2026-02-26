package com.example.chat_service.model;

public class ChatRequest {

    private String message;
    private boolean loggedIn;
    private String userId;

    // ===== GETTERS =====

    public String getMessage() {
        return message;
    }

    public boolean isLoggedIn() {
        return loggedIn;
    }

    public String getUserId() {
        return userId;
    }

    // ===== SETTERS =====

    public void setMessage(String message) {
        this.message = message;
    }

    public void setLoggedIn(boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
