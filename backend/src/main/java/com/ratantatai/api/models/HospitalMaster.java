package com.ratantatai.api.models;

import jakarta.persistence.*;

@Entity
@Table(name = "hospital_master")
public class HospitalMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;
    private String city;
    private String state;
    private String tier = "TIER_1";
    private String networkType = "NON_NETWORK";
    private Long standardRoomRentLimit;
    private Long premiumRoomRentLimit;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public String getNetworkType() { return networkType; }
    public void setNetworkType(String networkType) { this.networkType = networkType; }
    public Long getStandardRoomRentLimit() { return standardRoomRentLimit; }
    public void setStandardRoomRentLimit(Long standardRoomRentLimit) { this.standardRoomRentLimit = standardRoomRentLimit; }
    public Long getPremiumRoomRentLimit() { return premiumRoomRentLimit; }
    public void setPremiumRoomRentLimit(Long premiumRoomRentLimit) { this.premiumRoomRentLimit = premiumRoomRentLimit; }
}
