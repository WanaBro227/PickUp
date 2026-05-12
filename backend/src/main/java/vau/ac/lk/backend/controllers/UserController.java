package vau.ac.lk.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.models.User;
import vau.ac.lk.backend.models.support.Business;
import vau.ac.lk.backend.services.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{id}/become-seller")
    public ResponseEntity<?> applySeller(@PathVariable String id, @RequestBody Business business) {
        User updatedUser = userService.applySeller(id, business);

        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.badRequest().body("User not found or request failed.");
    }
}
