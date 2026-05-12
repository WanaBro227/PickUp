package vau.ac.lk.backend.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vau.ac.lk.backend.models.User;
import vau.ac.lk.backend.models.enums.RequestStatus;
import vau.ac.lk.backend.models.support.Business;
import vau.ac.lk.backend.repositories.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passEncoder) {
        this.userRepo = userRepo;
        this.passEncoder = passEncoder;
    }

    // Logic to register new user
    public User registerUser(User user) {
        user.setPassword(passEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    // Logic to find a user by email
    public Optional<User> findByEmail (String email) {
        return userRepo.findByEmail(email);
    }

    // Request for become a seller (API For BUYERS)
    public User applySeller(String id, Business business) {
        Optional<User> userOptional = userRepo.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            user.setBusinessDetails(business);
            user.setSellerRequestStatus(RequestStatus.PENDING);

            return userRepo.save(user);
        }

        return null;
    }
}
