package foodie_auth_service.foodie_auth_service.dto;

import lombok.Data;

@Data
public class IpLocation {
    private Double lat;
    private Double lon;
    private String city;
    private String country;
    private String isp;
}
