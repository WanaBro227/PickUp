package vau.ac.lk.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import vau.ac.lk.backend.models.enums.OrderStatus;
import vau.ac.lk.backend.models.support.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    private String buyerId;
    private String sellerId;
    private List<OrderItem> items;
    private Double totalAmount;
    private OrderStatus status = OrderStatus.PENDING;
    private String shippingAddress;
    private String paymentStatus;
    private LocalDateTime createdAt = LocalDateTime.now();

    /* Constructors */
    public Order() {}
    public Order(String id, String buyerId, String sellerId, List<OrderItem> items, Double totalAmount, OrderStatus status, String shippingAddress, String paymentStatus, LocalDateTime createdAt) {
        this.id = id;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
    }

    /* id */
    public String getId() {
        return id;
    }

    /* buyerId */
    public String getBuyerId() {
        return buyerId;
    }
    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    /* sellerId */
    public String getSellerId() {
        return sellerId;
    }
    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    /* items */
    public List<OrderItem> getItems() {
        return items;
    }
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    /* totalAmount */
    public Double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    /* status */
    public OrderStatus getStatus() {
        return status;
    }
    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    /* shippingAddress */
    public String getShippingAddress() {
        return shippingAddress;
    }
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    /* paymentStatus */
    public String getPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    /* createdAt */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
