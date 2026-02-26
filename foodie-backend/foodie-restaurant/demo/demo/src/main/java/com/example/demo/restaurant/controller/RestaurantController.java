package com.example.demo.restaurant.controller;

import com.example.demo.dto.KycReasonRequest;
import com.example.demo.restaurant.model.RestaurantKycAudit;
import com.example.demo.dto.RestaurantKycDTO;
import com.example.demo.restaurant.exception.RestaurantAlreadyExistException;
import com.example.demo.restaurant.exception.RestaurantNotExistException;
import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantBankDetails;
import com.example.demo.restaurant.model.RestaurantStatus;
import com.example.demo.restaurant.repository.RestaurantKycAuditRepository;
import com.example.demo.restaurant.repository.RestaurantRepository;
import com.example.demo.restaurant.service.RestaurantBankService;
import com.example.demo.restaurant.service.RestaurantService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/restaurant-api")
//@CrossOrigin("*")
@AllArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantBankService restaurantBankService;
    private final RestaurantKycAuditRepository auditRepo;
    // ======================================================
    // METHOD: POST
    // URL: http://localhost:9090/restaurant-api/restaurants
    // PURPOSE: Register restaurant (JWT required)
    // ======================================================
    @PostMapping(
            value = "/restaurants",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> createRestaurant(
            @RequestParam String restaurantName,
            @RequestParam String city,
            @RequestParam String address,
            @RequestParam String phone,
            @RequestParam String panCard,
            @RequestParam String fssaiLicence,
            @RequestParam String openingTime,
            @RequestParam String closingTime,
            @RequestParam MultipartFile image,
            Principal principal
    ) {

        String ownerEmail = principal.getName();   // from JWT

        // 🔥 1️⃣ PERMANENT BAN CHECK — MUST COME FIRST
        boolean permanentlyBlocked =
                restaurantRepository.findByOwnerEmail(ownerEmail)
                        .stream()
                        .anyMatch(r -> r.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED);

        if (permanentlyBlocked) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Your account has been permanently blocked from registering restaurants.");
        }

        // 🔥 2️⃣ BLOCK double-submit & fake re-registration
        boolean alreadyApplied =
                restaurantRepository.findByOwnerEmail(ownerEmail)
                        .stream()
                        .anyMatch(r ->
                                r.getStatus() == RestaurantStatus.PENDING ||
                                        r.getStatus() == RestaurantStatus.APPROVED ||
                                        r.getStatus() == RestaurantStatus.ON_HOLD
                        );

        if (alreadyApplied) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("You already have a restaurant under verification or approved");
        }

        // 🔥 3️⃣ Normalize name (prevents duplicate by spacing / case)
        String cleanName = restaurantName.trim().toLowerCase();

        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantName(cleanName);
        restaurant.setOwnerEmail(ownerEmail);
        restaurant.setCity(city);
        restaurant.setAddress(address);
        restaurant.setPhone(phone);
        restaurant.setPanCard(panCard);
        restaurant.setFssaiLicence(fssaiLicence);
        restaurant.setOpeningTime(LocalTime.parse(openingTime));
        restaurant.setClosingTime(LocalTime.parse(closingTime));

        try {
            Restaurant saved = restaurantService.addNewRestaurant(restaurant, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        }
        catch (RestaurantAlreadyExistException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }




//    @PutMapping(
//            value = "/restaurants/resubmit/{id}",
//            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
//    )
//    public ResponseEntity<?> resubmitRestaurant(
//            @PathVariable String id,
//            @RequestParam String restaurantName,
//            @RequestParam String city,
//            @RequestParam String address,
//            @RequestParam String phone,
//            @RequestParam String panCard,
//            @RequestParam String fssaiLicence,
//            @RequestParam String openingTime,
//            @RequestParam String closingTime,
//            @RequestParam(required = false) MultipartFile image,
//            Principal principal
//    ) {
//
//        String ownerEmail = principal.getName();
//
//        Restaurant restaurant = restaurantRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
//
//        // 🔐 Security: owner only
//        if (!restaurant.getOwnerEmail().equals(ownerEmail)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your restaurant");
//        }
//
//        // 🔐 Only editable when blocked
//        if (restaurant.getStatus() != RestaurantStatus.ON_HOLD &&
//                restaurant.getStatus() != RestaurantStatus.REJECTED) {
//            return ResponseEntity
//                    .badRequest()
//                    .body("Restaurant cannot be modified in this state");
//        }
//
//        // 🔥 Update existing restaurant
//        restaurant.setRestaurantName(restaurantName.trim().toLowerCase());
//        restaurant.setCity(city);
//        restaurant.setAddress(address);
//        restaurant.setPhone(phone);
//        restaurant.setPanCard(panCard);
//        restaurant.setFssaiLicence(fssaiLicence);
//        restaurant.setOpeningTime(LocalTime.parse(openingTime));
//        restaurant.setClosingTime(LocalTime.parse(closingTime));
//
//        if (image != null && !image.isEmpty()) {
//            String url = restaurantService.uploadImage(image);
//            restaurant.setRestaurantImageUrl(url);
//        }
//
//        // 🔁 Back to review
//        restaurant.setStatus(RestaurantStatus.PENDING);
//        restaurant.setActive(false);
//
//        restaurantRepository.save(restaurant);
//
//        // 🧾 Audit
//        auditRepo.save(new RestaurantKycAudit(
//                null,
//                restaurant.getId(),
//                "RESUBMITTED",
//                ownerEmail,
//                "Restaurant details updated and resubmitted",
//                LocalDateTime.now()
//        ));
//
//        return ResponseEntity.ok("Resubmitted successfully");
//    }




    // PUT: http://localhost:9091/restaurant-api/update
    @PutMapping("/restaurants/{id}")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurant,
            Principal principal
    ) {
        try {
            restaurant.setId(id);
            Restaurant updated = restaurantService.updateRestaurant(restaurant, principal.getName());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET: http://localhost:9091/owner/{emailId}
    // by ghazi
    @GetMapping("/owner/email/{email}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByOwnerEmail(
            @PathVariable String email
    ) throws RestaurantNotExistException {

        return ResponseEntity.ok(
                restaurantService.findByOwnerEmailId(email)
        );
    }
    // ---------------- Partner (PENDING) ----------------
    // by Ghazi


    // ---------------- Owner (APPROVED) ----------------
    //By Ghazi
    @GetMapping("/owner/{email}")
    public ResponseEntity<List<Restaurant>> getApprovedRestaurants(
            @PathVariable String email) {

        return ResponseEntity.ok(
                restaurantRepository
                        .findByOwnerEmailAndStatus(email, RestaurantStatus.APPROVED)
        );
    }
    // ---------------- Live ----------------
    // By Ghazi
    @GetMapping("/public/live/{email}")
    public ResponseEntity<List<Restaurant>> getLiveRestaurants(
            @PathVariable String email) {

        return ResponseEntity.ok(
                restaurantRepository
                        .findByOwnerEmailAndActiveTrue(email)
        );
    }



    //    // BY ghazi
//    // ADMIN APPROVES RESTAURANT PUT http://localhost:9092/restaurant-api/admin/approve/{id}
//    @PutMapping("/admin/approve/{id}")
//    public ResponseEntity<Restaurant> approveRestaurant(@PathVariable String id)
//            throws RestaurantNotExistException {
//
//        Restaurant approvedRestaurant = restaurantService.approveRestaurant(id);
//        return new ResponseEntity<>(approvedRestaurant, HttpStatus.OK);
//    }
    // By Ghazi ============ getRestaurantKyc
    @GetMapping("/admin/kyc/{restaurantId}")
    public ResponseEntity<RestaurantKycDTO> getRestaurantKyc(
            @PathVariable String restaurantId) {

        Restaurant restaurant = restaurantRepository
                .findById(restaurantId)
                .orElseThrow();

        RestaurantBankDetails bank =
                restaurantBankService.getBankDetailsByRestaurantId(restaurantId);

        boolean kycComplete =
                restaurant.getPanCard() != null &&
                        restaurant.getFssaiLicence() != null &&
                        restaurant.getRestaurantImageUrl() != null &&
                        bank != null;

        RestaurantKycDTO dto = new RestaurantKycDTO();
        dto.setRestaurant(restaurant);
        dto.setBankDetails(bank);
        dto.setKycComplete(kycComplete);

        return ResponseEntity.ok(dto);
    }
    //=======Get pending KYC list======
    @GetMapping("/admin/kyc/pending")
    public List<Restaurant> getPending() {
        return restaurantRepository.findByStatus(RestaurantStatus.PENDING);
    }

    //=========Get full KYC bundle (restaurant + bank)===========

//    @GetMapping("/admin/kyc/{restaurantId}")
//    public ResponseEntity<?> getKyc(@PathVariable String restaurantId) {
//
//        Restaurant restaurant = restaurantRepository.findById(restaurantId).get();
//        RestaurantBankDetails bank = restaurantBankService.getBankDetailsByRestaurantId(restaurantId);
//
//        boolean kycComplete =
//                restaurant.getPanCard() != null &&
//                        restaurant.getFssaiLicence() != null &&
//                        restaurant.getRestaurantImageUrl() != null &&
//                        bank != null;
//
//        return ResponseEntity.ok(Map.of(
//                "restaurant", restaurant,
//                "bank", bank,
//                "kycComplete", kycComplete
//        ));
//    }

    //=======Approve=======
//    @PutMapping("/admin/kyc/approve/{id}")
//    public ResponseEntity<?> approveKyc(
//            @PathVariable String id,
//            @RequestBody(required = false) KycReasonRequest body,
//            Principal admin
//    ) {
//        String note = body != null ? body.getReason() : null;
//
//        // 1️⃣ Load restaurant
//        Restaurant restaurant = restaurantRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
//
//        // 2️⃣ Validate state
//        if (restaurant.getStatus() == RestaurantStatus.APPROVED) {
//            return ResponseEntity.badRequest().body("Restaurant already approved");
//        }
//
//        if (restaurant.getStatus() == RestaurantStatus.REJECTED) {
//            return ResponseEntity.badRequest().body("Rejected restaurant cannot be approved");
//        }
//
//        // 3️⃣ Fetch Bank Details (KYC must be complete)
//        RestaurantBankDetails bank =
//                restaurantBankService.getBankDetailsByRestaurantId(id);
//
//        if (bank == null) {
//            return ResponseEntity
//                    .badRequest()
//                    .body("Bank details missing — cannot approve KYC");
//        }
//
//        // 4️⃣ Approve Restaurant
//        restaurant.setStatus(RestaurantStatus.APPROVED);
//        restaurant.setActive(false); // Must be made LIVE separately
//        restaurantRepository.save(restaurant);
//
//        // 5️⃣ Verify Bank
//        bank.setVerified(true);
//        restaurantBankService.updateBankDetails(bank);
//
//        // 6️⃣ Update Roles in AUTH SERVICE
//        try {
//            RestTemplate rest = new RestTemplate();
//
//            rest.postForObject(
//                    "http://localhost:9090/auth/remove-role?email=" + restaurant.getOwnerEmail() + "&roleName=RESTAURANT_PARTNER",
//                    null,
//                    String.class
//            );
//
//            rest.postForObject(
//                    "http://localhost:9090/auth/assign-role?email=" + restaurant.getOwnerEmail() + "&roleName=RESTAURANT_OWNER",
//                    null,
//                    String.class
//            );
//
//        } catch (Exception e) {
//            throw new RuntimeException("Role update failed. Approval aborted.");
//        }
//
//        // 7️⃣ Save Audit (This drives Recent Activity)
//        auditRepo.save(new RestaurantKycAudit(
//                null,
//                id,
//                "APPROVED",
//                admin.getName(),
//                (note == null || note.isBlank()) ? "KYC verified successfully" : note,
//                LocalDateTime.now()
//        ));
//
//        // 8️⃣ Return updated restaurant
//        return ResponseEntity.ok(restaurant);
//    }
//    @PutMapping("/admin/kyc/approve/{id}")
//    public ResponseEntity<?> approveKyc(
//            @PathVariable String id,
//            @RequestBody(required = false) KycReasonRequest body,
//            Principal admin
//    ) {
//        String note = body != null ? body.getReason() : null;
//
//        Restaurant r = restaurantRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
//
//        if (r.getStatus() == RestaurantStatus.APPROVED)
//            return ResponseEntity.badRequest().body("Already approved");
//
//        if (r.getStatus() == RestaurantStatus.REJECTED)
//            return ResponseEntity.badRequest().body("Rejected restaurant cannot be approved");
//
//        RestaurantBankDetails bank = restaurantBankService.getBankDetailsByRestaurantId(id);
//        if (bank == null)
//            return ResponseEntity.badRequest().body("Bank details missing");
//
//        r.setStatus(RestaurantStatus.APPROVED);
//        r.setActive(false);
//        restaurantRepository.save(r);
//
//        bank.setVerified(true);
//        restaurantBankService.updateBankDetails(bank);
//
//        RestTemplate rest = new RestTemplate();
//        rest.postForObject("http://localhost:9090/auth/remove-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_PARTNER", null, String.class);
//        rest.postForObject("http://localhost:9090/auth/assign-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_OWNER", null, String.class);
//
//        auditRepo.save(new RestaurantKycAudit(
//                null, id, "APPROVED", admin.getName(),
//                note == null || note.isBlank() ? "KYC Verified" : note,
//                LocalDateTime.now()
//        ));
//
//        return ResponseEntity.ok(r);
//    }

//    @PutMapping("/admin/kyc/approve/{id}")
//    public ResponseEntity<?> approveKyc(
//            @PathVariable String id,
//            @RequestBody(required = false) KycReasonRequest body,
//            Principal admin
//    ) {
//        String note = body != null ? body.getReason() : null;
//
//        Restaurant approved = restaurantService.approveRestaurant(id);
//
//        auditRepo.save(new RestaurantKycAudit(
//                null,
//                id,
//                "APPROVED",
//                admin.getName(),
//                note == null || note.isBlank() ? "KYC Verified" : note,
//                LocalDateTime.now()
//        ));
//
//        return ResponseEntity.ok(approved);
//    }

    @PutMapping("/admin/kyc/approve/{id}")
    public ResponseEntity<?> approveKyc(
            @PathVariable String id,
            @RequestBody(required = false) KycReasonRequest body,
            HttpServletRequest request,
            Principal admin
    ) {
        try {
            String note = body != null ? body.getReason() : null;

            Restaurant r = restaurantService.approveRestaurant(id);

            String email = r.getOwnerEmail();
            String authHeader = request.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();

            rest.exchange(
                    "http://localhost:9090/auth/remove-all-restaurant-roles?email=" + email,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            rest.exchange(
                    "http://localhost:9090/auth/assign-role?email=" + email + "&roleName=RESTAURANT_OWNER",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            auditRepo.save(new RestaurantKycAudit(
                    null,
                    id,
                    "APPROVED",
                    admin.getName(),
                    note == null || note.isBlank() ? "KYC Verified" : note,
                    LocalDateTime.now()
            ));

            return ResponseEntity.ok(r);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }





    //
//    @PutMapping("/admin/kyc/suspend/{id}")
//    public ResponseEntity<?> suspend(
//            @PathVariable String id,
//            @RequestBody KycReasonRequest body,
//            Principal admin
//    ) {
//        if (body == null || body.getReason() == null || body.getReason().isBlank())
//            return ResponseEntity.badRequest().body("Suspension reason required");
//
//        Restaurant r = restaurantRepository.findById(id).orElseThrow();
//        r.setStatus(RestaurantStatus.SUSPENDED);
//        r.setActive(false);
//        restaurantRepository.save(r);
//
//        auditRepo.save(new RestaurantKycAudit(
//                null, id, "SUSPENDED", admin.getName(),
//                body.getReason(), LocalDateTime.now()
//        ));
//
//        return ResponseEntity.ok("Suspended");
//    }

    @PutMapping("/admin/kyc/suspend/{id}")
    public ResponseEntity<?> suspend(
            @PathVariable String id,
            @RequestBody KycReasonRequest body,
            HttpServletRequest request,
            Principal admin
    ) {
        if (body == null || body.getReason() == null || body.getReason().isBlank())
            return ResponseEntity.badRequest().body("Suspension reason required");

        try {
            // 1️⃣ Change restaurant state only
            Restaurant r = restaurantService.suspendRestaurant(
                    id,
                    admin.getName(),
                    body.getReason()
            );

            // 2️⃣ Fix user roles securely
            String token = request.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();

            // Remove OWNER
            rest.exchange(
                    "http://localhost:9090/auth/remove-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_OWNER",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Give PARTNER
            rest.exchange(
                    "http://localhost:9090/auth/assign-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_PARTNER",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            return ResponseEntity.ok("Restaurant suspended");

        } catch (RestaurantNotExistException e) {
            return ResponseEntity.status(404).body("Restaurant not found");

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }






    @PutMapping("/admin/restaurant/live/{id}")
    public void goLive(@PathVariable String id, Principal admin) {

        Restaurant r = restaurantRepository.findById(id).orElseThrow();

        if(r.getStatus() != RestaurantStatus.APPROVED)
            throw new RuntimeException("Not approved");

        r.setActive(true);
        restaurantRepository.save(r);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "LIVE",
                admin.getName(),
                "Restaurant made live",
                LocalDateTime.now()
        ));
    }



    //========Reject=======
//   @PutMapping("/admin/kyc/reject/{id}")
//   public void reject(@PathVariable String id,
//                      @RequestBody String reason,
//                      Principal admin) {
//
//       Restaurant r = restaurantRepository.findById(id).get();
//       r.setStatus(RestaurantStatus.REJECTED);
//       restaurantRepository.save(r);
//
//       auditRepo.save(new RestaurantKycAudit(
//               null, id, "REJECTED", admin.getName(), reason, LocalDateTime.now()
//       ));
//   }
    @PutMapping("/admin/kyc/reject/{id}")
    public ResponseEntity<?> reject(
            @PathVariable String id,
            @RequestBody KycReasonRequest body,
            HttpServletRequest request,
            Principal admin
    ) {
        if (body == null || body.getReason() == null || body.getReason().isBlank())
            return ResponseEntity.badRequest().body("Rejection reason required");

        try {
            // 1️⃣ Update restaurant + audit
            Restaurant r = restaurantService.rejectRestaurantByAdmin(
                    id,
                    admin.getName(),
                    body.getReason()
            );

            // 2️⃣ Securely revoke all restaurant roles
            String token = request.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();

            rest.exchange(
                    "http://localhost:9090/auth/remove-all-restaurant-roles?email=" + r.getOwnerEmail(),
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            return ResponseEntity.ok("Rejected");

        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }





    //=========Admin Dashboard API===

    @GetMapping("/admin/stats")
    public Map<String,Object> stats() {
        return Map.of(
                "total", restaurantRepository.count(),
                "active", restaurantRepository.countByActiveTrue(),
                "pending", restaurantRepository.countByStatus(RestaurantStatus.PENDING)
        );
    }

    @GetMapping("/admin/kyc/audit/{restaurantId}")
    public List<RestaurantKycAudit> getAuditTrail(
            @PathVariable String restaurantId) {

        return auditRepo.findByRestaurantId(restaurantId);
    }

//    @PutMapping("/admin/kyc/hold/{id}")
//    public void hold(@PathVariable String id, Principal admin) {
//
//        Restaurant r = restaurantRepository.findById(id).orElseThrow();
//
//        r.setStatus(RestaurantStatus.ON_HOLD);
//        r.setActive(false);
//        restaurantRepository.save(r);
//
//        auditRepo.save(new RestaurantKycAudit(
//                null,
//                id,
//                "ON_HOLD",
//                admin.getName(),
//                null,
//                LocalDateTime.now()
//        ));
//    }

    @PutMapping("/admin/kyc/hold/{id}")
    public ResponseEntity<?> hold(
            @PathVariable String id,
            @RequestBody(required = false) KycReasonRequest body,
            HttpServletRequest request,
            Principal admin
    ) {
        String reason = (body != null && body.getReason() != null && !body.getReason().isBlank())
                ? body.getReason()
                : "Documents need clarification";

        try {
            // 1️⃣ Update restaurant + audit
            Restaurant r = restaurantService.holdRestaurantByAdmin(
                    id,
                    admin.getName(),
                    reason
            );

            // 2️⃣ Forward JWT to Auth Service
            String token = request.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();

            // Remove OWNER
            rest.exchange(
                    "http://localhost:9090/auth/remove-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_OWNER",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Ensure PARTNER
            rest.exchange(
                    "http://localhost:9090/auth/assign-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_PARTNER",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            return ResponseEntity.ok("Restaurant put on hold");

        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }




    @GetMapping("/admin/restaurants")
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @GetMapping("/admin/stats/cities")
    public List<Map<String, Object>> cityStats() {
        return restaurantRepository.countByCity();
    }
    @GetMapping("/admin/restaurants/suspended")
    public List<Restaurant> suspended() {
        return restaurantRepository.findByStatus(RestaurantStatus.SUSPENDED);
    }

    @GetMapping("/admin/restaurants/rejected")
    public List<Restaurant> rejected() {
        return restaurantRepository.findByStatus(RestaurantStatus.REJECTED);
    }
    @GetMapping("/admin/restaurants/search")
    public List<Restaurant> search(@RequestParam String q) {
        return restaurantRepository.search(q.toLowerCase());
    }

    @PutMapping("/admin/restaurant/offline/{id}")
    public void goOffline(@PathVariable String id, Principal admin) {

        Restaurant r = restaurantRepository.findById(id).orElseThrow();
        r.setActive(false);
        restaurantRepository.save(r);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "OFFLINE",
                admin.getName(),
                "Restaurant taken offline",
                LocalDateTime.now()
        ));
    }
    @PutMapping("/admin/restaurant/reinstate/{id}")
    public ResponseEntity<?> reinstate(
            @PathVariable String id,
            HttpServletRequest request,
            Principal admin
    ) {
        try {
            // 1️⃣ Restore KYC in DB
            Restaurant r = restaurantService.reinstateRestaurant(id, admin.getName());

            // 2️⃣ Forward admin JWT to Auth service
            String token = request.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();

            // Remove all restaurant roles
            rest.exchange(
                    "http://localhost:9090/auth/remove-all-restaurant-roles?email=" + r.getOwnerEmail(),
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Grant OWNER again
            rest.exchange(
                    "http://localhost:9090/auth/assign-role?email=" + r.getOwnerEmail() + "&roleName=RESTAURANT_OWNER",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            return ResponseEntity.ok(r);

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/admin/activity")
    public List<RestaurantKycAudit> recentActivity() {
        return auditRepo.findTop50ByOrderByTimestampDesc();
    }
    @GetMapping("/restaurant/status/{id}")
    public Map<String, Object> getRestaurantStatus(@PathVariable String id) {

        Restaurant r = restaurantRepository.findById(id).orElseThrow();

        RestaurantKycAudit last =
                auditRepo.findTop1ByRestaurantIdOrderByTimestampDesc(id);

        return Map.of(
                "status", r.getStatus(),
                "active", r.isActive(),
                "reason", last != null ? last.getReason() : null
        );
    }

    @GetMapping("/partner/kyc/reason/{id}")
    public ResponseEntity<?> partnerKycReason(@PathVariable String id, Principal user) {

        Restaurant r = restaurantRepository.findById(id).orElseThrow();

        if (!r.getOwnerEmail().equals(user.getName()))
            return ResponseEntity.status(403).build();

        RestaurantKycAudit last =
                auditRepo.findTop1ByRestaurantIdOrderByTimestampDesc(id);

        return ResponseEntity.ok(
                last == null
                        ? Map.of("reason", "Under verification")
                        : Map.of("reason", last.getReason(), "action", last.getAction())
        );
    }

    @PutMapping("/admin/kyc/block/{id}")
    public ResponseEntity<?> permanentlyBlock(
            @PathVariable String id,
            @RequestBody KycReasonRequest body,
            HttpServletRequest request,
            Principal admin
    ) {
        if (body == null || body.getReason() == null || body.getReason().isBlank())
            return ResponseEntity.badRequest().body("Reason required");

        try {
            // 1️⃣ Lock restaurant + audit
            Restaurant r = restaurantService.permanentlyBlockRestaurant(
                    id,
                    admin.getName(),
                    body.getReason()
            );

            // 2️⃣ Forward JWT to Auth Service
            String token = request.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();

            // Revoke all restaurant roles
            rest.exchange(
                    "http://localhost:9090/auth/remove-all-restaurant-roles?email=" + r.getOwnerEmail(),
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            return ResponseEntity.ok(r);

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/owner/restaurant/live/{id}")
    public ResponseEntity<?> ownerGoLive(
            @PathVariable String id,
            Principal owner
    ) {
        Restaurant r = restaurantRepository.findById(id).orElseThrow();

        if (!r.getOwnerEmail().equals(owner.getName()))
            return ResponseEntity.status(403).body("Not your restaurant");

        if (r.getStatus() != RestaurantStatus.APPROVED)
            return ResponseEntity.badRequest().body("Restaurant not approved");

        r.setActive(true);
        restaurantRepository.save(r);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "LIVE",
                owner.getName(),
                "Restaurant made live by owner",
                LocalDateTime.now()
        ));

        return ResponseEntity.ok("Restaurant is LIVE");
    }

    @PutMapping("/owner/restaurant/offline/{id}")
    public ResponseEntity<?> ownerGoOffline(
            @PathVariable String id,
            Principal owner
    ) {
        Restaurant r = restaurantRepository.findById(id).orElseThrow();

        if (!r.getOwnerEmail().equals(owner.getName()))
            return ResponseEntity.status(403).body("Not your restaurant");

        r.setActive(false);
        restaurantRepository.save(r);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "OFFLINE",
                owner.getName(),
                "Restaurant taken offline by owner",
                LocalDateTime.now()
        ));

        return ResponseEntity.ok("Restaurant is OFFLINE");
    }

    // ---------------- Partner (ALL NON-LIVE STATES) ----------------
    @GetMapping("/partner/{email}")
    public ResponseEntity<List<Restaurant>> getPartnerRestaurants(
            @PathVariable String email,
            Principal principal
    ) {
        if (!principal.getName().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                restaurantRepository.findByOwnerEmailAndStatusIn(
                        email,
                        List.of(
                                RestaurantStatus.PENDING,
                                RestaurantStatus.ON_HOLD,
                                RestaurantStatus.REJECTED,
                                RestaurantStatus.SUSPENDED,
                                RestaurantStatus.APPROVED
                        )
                )
        );
    }
    @GetMapping("/my-restaurant")
    public ResponseEntity<?> getMyRestaurant(Principal principal) {

        String email = principal.getName();

        // 🚫 Permanent block = hard stop
        boolean blocked = restaurantRepository.existsByOwnerEmailAndStatus(
                email,
                RestaurantStatus.PERMANENTLY_BLOCKED
        );

        if (blocked) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", "PERMANENTLY_BLOCKED"));
        }

        return restaurantRepository.findByOwnerEmail(email)
                .stream()
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(null));
    }


}
