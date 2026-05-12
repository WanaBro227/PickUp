package vau.ac.lk.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import vau.ac.lk.backend.models.enums.RequestStatus;
import vau.ac.lk.backend.models.enums.UserRole;
import vau.ac.lk.backend.models.support.Address;
import vau.ac.lk.backend.models.support.Business;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String fullName;
    private UserRole role = UserRole.BUYER;
    private String profilePic;
    private List<Address> addresses;
    private RequestStatus sellerRequestStatus = RequestStatus.NONE;
    private Business businessDetails;
    private LocalDateTime createdAt = LocalDateTime.now();

    /* Constructors */
    public User() {}
    public User(String id, String email, String password, String fullName, UserRole role, String profilePic, List<Address> addresses, RequestStatus sellerRequestStatus, Business businessDetails, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.profilePic = profilePic;
        this.addresses = addresses;
        this.sellerRequestStatus = sellerRequestStatus;
        this.businessDetails = businessDetails;
        this.createdAt = createdAt;
    }

    /* id */
    public String getId() {
        return id;
    }

    /* email */
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    /* password */
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    /* fullName */
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /* role */
    public UserRole getRole() {
        return role;
    }
    public void setRole(UserRole role) {
        this.role = role;
    }

    /* profilePic */
    public String getProfilePic() {
        return profilePic;
    }
    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
    /* addresses */
    public List<Address> getAddresses() {
        return addresses;
    }
    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    /* sellerRequestStatus */
    public RequestStatus getSellerRequestStatus() {
        return sellerRequestStatus;
    }
    public void setSellerRequestStatus(RequestStatus sellerRequestStatus) {
        this.sellerRequestStatus = sellerRequestStatus;
    }

    /* businessDetails */
    public Business getBusinessDetails() {
        return businessDetails;
    }
    public void setBusinessDetails(Business businessDetails) {
        this.businessDetails = businessDetails;
    }

    /* createdAt */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
