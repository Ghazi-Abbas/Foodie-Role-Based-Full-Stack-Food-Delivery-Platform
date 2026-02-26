//package com.example.demo.menu.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class OpenAiFoodServiceImpl implements OpenAiFoodService {
//
//    @Value("${openai.api-key}")
//    private String apiKey;
//
//    @Value("${openai.model}")
//    private String model;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @Override
//    public String getFoodInsights(String dishName) {
//
//        String prompt = """
//        Give food information for %s (100g):
//        - Short description
//        - Approx calories
//        - Nutrition highlights
//        - Health benefits
//        Keep it simple and user friendly.
//        """.formatted(dishName);
//
//        String url = "https://api.openai.com/v1/responses";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(apiKey); // ✅ REQUIRED
//
//        Map<String, Object> body = Map.of(
//                "model", model,
//                "input", prompt
//        );
//
//        try {
//            ResponseEntity<Map> response =
//                    restTemplate.postForEntity(
//                            url,
//                            new HttpEntity<>(body, headers),
//                            Map.class
//                    );
//
//            return extractText(response.getBody());
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "AI food insights are temporarily unavailable.";
//        }
//    }
//
//    @SuppressWarnings("unchecked")
//    private String extractText(Map<String, Object> body) {
//
//        if (body == null) return "AI info not available.";
//
//        List<Map<String, Object>> output =
//                (List<Map<String, Object>>) body.get("output");
//
//        if (output == null || output.isEmpty())
//            return "AI info not available.";
//
//        List<Map<String, Object>> content =
//                (List<Map<String, Object>>) output.get(0).get("content");
//
//        if (content == null || content.isEmpty())
//            return "AI info not available.";
//
//        return content.get(0).get("text").toString();
//    }
//}
//#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
package com.example.demo.menu.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiFoodServiceImpl implements OpenAiFoodService {

    // 🔑 GROQ API KEY
    @Value("${groq.api-key}")
    private String apiKey;

    // 🤖 MODEL (mixtral / llama)
    @Value("${groq.model}")
    private String model;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getFoodInsights(String dishName) {

        String prompt = """
        Give food information for %s (100g):
        - Short description
        - Approx calories
        - Nutrition highlights
        - Health benefits
        Keep it simple and user friendly.
        """.formatted(dishName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
        );

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            GROQ_URL,
                            new HttpEntity<>(body, headers),
                            Map.class
                    );

            return extractText(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return "AI food insights are temporarily unavailable.";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> body) {

        if (body == null) return "AI info not available.";

        List<Map<String, Object>> choices =
                (List<Map<String, Object>>) body.get("choices");

        if (choices == null || choices.isEmpty())
            return "AI info not available.";

        Map<String, Object> message =
                (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString();
    }
}
