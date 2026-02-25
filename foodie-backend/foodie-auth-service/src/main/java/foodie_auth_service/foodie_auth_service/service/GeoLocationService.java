package foodie_auth_service.foodie_auth_service.service;

import foodie_auth_service.foodie_auth_service.dto.IpLocation;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeoLocationService {

    private final RestTemplate restTemplate = new RestTemplate();

    public IpLocation getLocation(String ip) {
        try {
            String url = "http://ip-api.com/json/" + ip;
            return restTemplate.getForObject(url, IpLocation.class);
        } catch (Exception e) {
            return null;
        }
    }
}

