package com.example.chat_service.service.impl;

import com.example.chat_service.client.OrderClient;
import com.example.chat_service.client.RestaurantClient;
import com.example.chat_service.client.UserClient;
import com.example.chat_service.model.ChatIntent;
import com.example.chat_service.model.ChatRequest;
import com.example.chat_service.model.ChatResponse;
import com.example.chat_service.service.AiService;
import com.example.chat_service.service.ChatService;
import com.example.chat_service.service.ContextService;
import com.example.chat_service.service.IntentResolver;
import com.example.chat_service.util.ResponseBuilder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final IntentResolver intentResolver;
    private final ContextService contextService;
    private final UserClient userClient;
    private final RestaurantClient restaurantClient;
    private final OrderClient orderClient;
    private final AiService aiService;

    public ChatServiceImpl(
            IntentResolver intentResolver,
            ContextService contextService,
            UserClient userClient,
            RestaurantClient restaurantClient,
            OrderClient orderClient,
            AiService aiService
    ) {
        this.intentResolver = intentResolver;
        this.contextService = contextService;
        this.userClient = userClient;
        this.restaurantClient = restaurantClient;
        this.orderClient = orderClient;
        this.aiService = aiService;
    }

    @Override
    public ChatResponse process(ChatRequest request, String authHeader) {

        try {
            // 1️⃣ Resolve intent
            ChatIntent intent = intentResolver.resolve(request.getMessage());

            // 2️⃣ Store context
            if (request.isLoggedIn() && request.getUserId() != null) {
                contextService.updateContext(request.getUserId(), intent);
            }

            // 3️⃣ Route by intent
            switch (intent) {

                // ================= GREETING =================
                case GREETING:
                    return ResponseBuilder.menu(
                            "Hi 👋 What would you like to explore today?",
                            List.of(
                                    Map.of("label", "🥬 Veg Items", "value", "veg"),
                                    Map.of("label", "🍗 Non-Veg Items", "value", "nonveg"),
                                    Map.of("label", "🍟 Snacks", "value", "snacks"),
                                    Map.of("label", "🥤 Beverages", "value", "beverages"),
                                    Map.of("label", "🍰 Desserts", "value", "desserts"),
                                    Map.of("label", "🛒 View Cart", "value", "cart"),
                                    Map.of("label", "📦 My Orders", "value", "orders"),
                                    Map.of("label", "🧑‍💼 Support", "value", "support")
                            )
                    );

                // ================= VEG =================
                case VEG_ITEMS:
                    return ResponseBuilder.cards(
                            "🥬 Veg Items Available",
                            restaurantClient.getVegItems()
                    );

                // ================= NON-VEG =================
                case NON_VEG_ITEMS:
                    return ResponseBuilder.cards(
                            "🍗 Non-Veg Items Available",
                            restaurantClient.getNonVegItems()
                    );

                // ================= SNACKS =================
                case SNACKS:
                    return ResponseBuilder.cards(
                            "🍟 Snacks You’ll Love",
                            restaurantClient.getSnacks()
                    );

                // ================= BEVERAGES =================
                case BEVERAGES:
                    return ResponseBuilder.cards(
                            "🥤 Refreshing Beverages",
                            restaurantClient.getBeverages()
                    );

                // ================= DESSERTS =================
                case DESSERTS:
                    return ResponseBuilder.cards(
                            "🍰 Sweet Desserts",
                            restaurantClient.getDesserts()
                    );

                // ================= CART =================
                case VIEW_CART:
                    if (!request.isLoggedIn() || authHeader == null || authHeader.isBlank()) {
                        return ResponseBuilder.text("🔐 Please login to view your cart 🛒");
                    }

                    List<Map<String, Object>> cartItems =
                            userClient.getFullCart(authHeader);

                    if (cartItems == null || cartItems.isEmpty()) {
                        return ResponseBuilder.text("🛒 Your cart is empty");
                    }

                    return ResponseBuilder.cards(
                            "🛒 Your Cart",
                            cartItems
                    );


                // ================= ORDERS (🔥 FIXED) =================
                case VIEW_ORDERS:
                    if (!request.isLoggedIn() || authHeader == null || authHeader.isBlank()) {
                        return ResponseBuilder.text("🔐 Please login to view your orders 📦");
                    }

                    List<Map<String, Object>> orders =
                            orderClient.getActiveOrders(authHeader);

                    if (orders == null || orders.isEmpty()) {
                        return ResponseBuilder.text("📦 You have no active orders");
                    }

                    // 🔥 MAP RAW ORDERS → CHAT CARDS
                    List<Map<String, Object>> orderCards = orders.stream()
                            .map(this::mapOrderToChatCard)
                            .collect(Collectors.toList());

                    return ResponseBuilder.cards(
                            "📦 Your Active Orders",
                            orderCards
                    );

                // ================= SUPPORT =================
                case SUPPORT:
                    return ResponseBuilder.menu(
                            "🧑‍💼 How can we help you?",
                            List.of(
                                    Map.of("label", "📦 Order not delivered", "value", "support_order_delay"),
                                    Map.of("label", "❌ Wrong item received", "value", "support_wrong_item"),
                                    Map.of("label", "💸 Refund related", "value", "support_refund"),
                                    Map.of("label", "☎️ Contact support", "value", "support_contact")
                            )
                    );

                // ================= AI FALLBACK =================
                default:
                    return ResponseBuilder.text(
                            aiService.generateReply(request.getMessage())
                    );
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseBuilder.text(
                    "❌ Something went wrong. Please try again."
            );
        }
    }

    // =========================================================
    // 🔥 ORDER → CHAT CARD MAPPER (DO NOT REMOVE)
    // =========================================================
//    private Map<String, Object> mapOrderToChatCard(Map<String, Object> order) {
//
//        List<Map<String, Object>> items =
//                (List<Map<String, Object>>) order.get("items");
//
//        Map<String, Object> firstItem =
//                (items != null && !items.isEmpty()) ? items.get(0) : Map.of();
//
//        return Map.of(
//                "name", order.get("restaurantName"),
//                "imageUrl", firstItem.get("imageUrl"),
//                "price", order.get("totalAmount"),
//                "itemName", firstItem.get("itemName"),
//                "deliveryTime", "30 min",
//                "createdAt", order.get("createdAt"),
//                "orderStatus", order.get("orderStatus")
//        );
//    }

    private Map<String, Object> mapOrderToChatCard(Map<String, Object> order) {

        Map<String, Object> card = new HashMap<>();

        List<Map<String, Object>> items =
                (List<Map<String, Object>>) order.get("items");

        Map<String, Object> firstItem =
                (items != null && !items.isEmpty()) ? items.get(0) : null;

        String imageUrl = null;
        String itemName = "Items";

        if (firstItem != null) {
            imageUrl = (String) firstItem.get("imageUrl");
            itemName = (String) firstItem.getOrDefault("itemName", "Item");
        }

        card.put("name", order.getOrDefault("restaurantName", "Unknown Restaurant"));
        card.put("price", order.getOrDefault("totalAmount", 0));
        card.put("deliveryTime", "30 min");
        card.put("createdAt", order.get("createdAt"));
        card.put("orderStatus", order.getOrDefault("orderStatus", "PROCESSING"));

        // 🔥 IMAGE KEYS (IMPORTANT)
        card.put("image", imageUrl);        // most UIs expect this
        card.put("imageUrl", imageUrl);     // fallback
        card.put("thumbnail", imageUrl);    // mobile-safe

        card.put("itemName", itemName);

        return card;
    }


}
