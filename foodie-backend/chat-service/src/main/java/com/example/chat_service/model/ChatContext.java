package com.example.chat_service.model;

public class ChatContext {

    private ChatIntent lastIntent;
    private String lastRestaurantId;
    private String lastCategory;

    public ChatIntent getLastIntent() {
        return lastIntent;
    }

    public void setLastIntent(ChatIntent lastIntent) {
        this.lastIntent = lastIntent;
    }

    public String getLastRestaurantId() {
        return lastRestaurantId;
    }

    public void setLastRestaurantId(String lastRestaurantId) {
        this.lastRestaurantId = lastRestaurantId;
    }

    public String getLastCategory() {
        return lastCategory;
    }

    public void setLastCategory(String lastCategory) {
        this.lastCategory = lastCategory;
    }
}
