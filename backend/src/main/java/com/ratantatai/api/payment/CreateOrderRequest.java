package com.ratantatai.api.payment;

import com.fasterxml.jackson.databind.JsonNode;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;


public class CreateOrderRequest {

    @NotNull
    @Min(100)
    private Long amountPaise;

    @NotBlank
    private String receipt;

    private JsonNode notes;

    public Long getAmountPaise() {
        return amountPaise;
    }

    public void setAmountPaise(Long amountPaise) {
        this.amountPaise = amountPaise;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public JsonNode getNotes() {
        return notes;
    }

    public void setNotes(JsonNode notes) {
        this.notes = notes;
    }
}
