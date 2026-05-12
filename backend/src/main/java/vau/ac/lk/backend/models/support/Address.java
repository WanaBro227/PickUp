package vau.ac.lk.backend.models.support;

public class Address {
    private String street;
    private String city;
    private String province;
    private String zipCode;
    private boolean isDefault;

    /* Constructors */
    public Address() {}
    public Address(String street, String city, String province, String zipCode, boolean isDefault) {
        this.street = street;
        this.city = city;
        this.province = province;
        this.zipCode = zipCode;
        this.isDefault = isDefault;
    }

    /* street */
    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
    }

    /* city */
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    /* province */
    public String getProvince() {
        return province;
    }
    public void setProvince(String province) {
        this.province = province;
    }

    /* zipCode */
    public String getZipCode() {
        return zipCode;
    }
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    /* isDefault */
    public boolean getIsDefault() {
        return isDefault;
    }
    public void setIsDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
}
