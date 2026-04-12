package com.ratantatai.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class InsuranceApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuranceApiApplication.class, args);
    }
}
