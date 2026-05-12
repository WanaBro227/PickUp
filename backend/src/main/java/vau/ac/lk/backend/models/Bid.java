package vau.ac.lk.backend.models;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bids")
public class Bid {
    @Id
    private String id;

    private String productId;
    private String bidderId;
    private Double bidAmount;
    private LocalDateTime bidTime = LocalDateTime.now();

    /* Constructors */
    public Bid() {}
    public Bid(String id, String productId, String bidderId, Double bidAmount, LocalDateTime bidTime) {
        this.id = id;
        this.productId = productId;
        this.bidderId = bidderId;
        this.bidAmount = bidAmount;
        this.bidTime = bidTime;
    }

    /* Id */
    public String getId() {
        return id;
    }

    /* productId */
    public String getProductId() {
        return productId;
    }
    public void setProductId(String productId) {
        this.productId = productId;
    }

    /* bidderId */
    public String getBidderId() {
        return bidderId;
    }
    public void setBidderId(String bidderId) {
        this.bidderId = bidderId;
    }

    /* bidAAmount */
    public Double getBidAmount() {
        return bidAmount;
    }
    public void setBidAmount(Double bidAmount) {
        this.bidAmount = bidAmount;
    }

    /* bidTime */
    public LocalDateTime getBidTime() {
        return bidTime;
    }
    public void setBidTime(LocalDateTime bidTime) {
        this.bidTime = bidTime;
    }
}
