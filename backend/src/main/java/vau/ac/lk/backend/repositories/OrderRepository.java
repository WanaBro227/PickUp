package vau.ac.lk.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.models.Order;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByBuyerId (String buyerId);
    List<Order> findBySellerId (String sellerId);
}
