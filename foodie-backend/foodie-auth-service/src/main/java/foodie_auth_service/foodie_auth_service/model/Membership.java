package foodie_auth_service.foodie_auth_service.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "membership")
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long membershipId;

    @OneToOne
    private User user;

    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}

