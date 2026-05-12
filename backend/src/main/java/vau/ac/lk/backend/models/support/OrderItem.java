package vau.ac.lk.backend.models.support;

public class OrderItem {
    private String productId;
    private String productTitle;
    private Integer quantity;
    private Double pricePurchase;

    /*  */
    public OrderItem() {}
    public OrderItem(String productId, String productTitle, Integer quantity, Double pricePurchase) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.quantity = quantity;
        this.pricePurchase = pricePurchase;
    }

    /* productId */
    public String getProductId() {
        return productId;
    }
    public void setProductId(String productId) {
        this.productId = productId;
    }

    /* productTitle */
    public String getProductTitle() {
        return productTitle;
    }
    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    /* quantity */
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    /* pricePurchase */
    public Double getPricePurchase() {
        return pricePurchase;
    }
    public void setPricePurchase(Double pricePurchase) {
        this.pricePurchase = pricePurchase;
    }
}
