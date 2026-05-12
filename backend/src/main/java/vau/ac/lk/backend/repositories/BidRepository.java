package vau.ac.lk.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.models.Bid;

import java.util.List;

public interface BidRepository extends MongoRepository<Bid, String> {
    List<Bid> findByProductIdOrderByBidAmountDesc (String productId);
}
