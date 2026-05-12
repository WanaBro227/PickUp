package vau.ac.lk.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import vau.ac.lk.backend.models.enums.ProductType;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
public class Product {
    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String sellerId;
    private ProductType type = ProductType.FIXED;

    // Fixed Price Fields
    private Double price;
    private Integer stock;

    // Auction Fields
    private Double startPrice;
    private Double currentBid;
    private Double reservePrice;
    private LocalDateTime endTime;
    private String winnerId;

    private List<String> images;
    private String status = "ACTIVE"; // ACTIVE, ENDED, DRAFT

    private LocalDateTime createdAt = LocalDateTime.now();

    /* Constructors */
    public Product() {}
    public Product(String id, String title, String description, String category, String sellerId, ProductType type, Double price, Integer stock, Double startPrice, Double currentBid, Double reservePrice, LocalDateTime endTime, String winnerId,  List<String> images, String status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.sellerId = sellerId;
        this.type = type;
        this.price = price;
        this.stock = stock;
        this.startPrice = startPrice;
        this.currentBid = currentBid;
        this.reservePrice = reservePrice;
        this.endTime = endTime;
        this.winnerId = winnerId;
        this.images = images;
        this.status = status;
        this.createdAt = createdAt;
    }

    /* id */
    public String getId() {
        return id;
    }

    /* title */
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    /* description */
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    /* category */
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    /* sellerId */
    public String getSellerId() {
        return sellerId;
    }
    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    /* type */
    public ProductType getType() {
        return type;
    }
    public void setType(ProductType type) {
        this.type = type;
    }

    /* price */
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }

    /* stock */
    public Integer getStock() {
        return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    /* startPrice */
    public Double getStartPrice() {
        return startPrice;
    }
    public void setStartPrice(Double startPrice) {
        this.startPrice = startPrice;
    }

    /* currentBid */
    public Double getCurrentBid() {
        return currentBid;
    }
    public void setCurrentBid(Double currentBid) {
        this.currentBid = currentBid;
    }

    /* reservePrice */
    public Double getReservePrice() {
        return reservePrice;
    }
    public void setReservePrice(Double reservePrice) {
        this.reservePrice = reservePrice;
    }

    /* endTime */
    public LocalDateTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    /* winnerId */
    public String getWinnerId() {
        return winnerId;
    }
    public void setWinnerId(String winnerId) {
        this.winnerId = winnerId;
    }

    /* images */
    public List<String> getImages() {
        return images;
    }
    public void setImages(List<String> images) {
        this.images = images;
    }

    /* status */
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    /* createdAt */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
