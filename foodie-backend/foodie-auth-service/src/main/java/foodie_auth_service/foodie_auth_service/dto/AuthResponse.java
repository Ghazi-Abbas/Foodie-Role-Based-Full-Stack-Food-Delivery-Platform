package foodie_auth_service.foodie_auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    private List<String> roles;
}
