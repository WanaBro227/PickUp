package vau.ac.lk.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.models.User;
import vau.ac.lk.backend.models.enums.RequestStatus;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    List<User> findBySellerRequestStatus(RequestStatus status);
}
