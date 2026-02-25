package foodie_auth_service.foodie_auth_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true)
    private String email;

    private String name;

    private String passwordHash;

    private boolean isEmailVerified;

    private boolean isProfileCompleted;

    private String status;
    // ACTIVE | INACTIVE | PENDING_APPROVAL

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> userRoles = new ArrayList<>();

    public List<UserRole> getUserRoles() {
        return userRoles;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean isEmailVerified() {
        return isEmailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }

    public boolean isProfileCompleted() {
        return isProfileCompleted;
    }

    public void setProfileCompleted(boolean profileCompleted) {
        isProfileCompleted = profileCompleted;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return isEmailVerified == user.isEmailVerified && isProfileCompleted == user.isProfileCompleted && Objects.equals(userId, user.userId) && Objects.equals(email, user.email) && Objects.equals(name, user.name) && Objects.equals(passwordHash, user.passwordHash) && Objects.equals(status, user.status) && Objects.equals(createdAt, user.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, email, name, passwordHash, isEmailVerified, isProfileCompleted, status, createdAt);
    }
}


