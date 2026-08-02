package com.gisttbackend.gisttbackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "sms-gateway")
public class SmsGatewayProperties {

    private String deviceHost;
    private int devicePort = 8080;
    private String username;
    private String password;

    public String getDeviceHost() { return deviceHost; }
    public void setDeviceHost(String deviceHost) { this.deviceHost = deviceHost; }

    public int getDevicePort() { return devicePort; }
    public void setDevicePort(int devicePort) { this.devicePort = devicePort; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    private String sendEndpoint = "/message";

    public String getSendEndpoint() {
        return sendEndpoint;
    }

    public void setSendEndpoint(String sendEndpoint) {
        this.sendEndpoint = sendEndpoint;
    }
}
