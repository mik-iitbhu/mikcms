package com.miknewscms.domains;

import java.io.Serializable;
import java.lang.String;


public class Header implements Serializable {

	
	private String traceId;
	private String token;
	private String error;
	private String status;
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	private static final long serialVersionUID = 1L;

	public Header() {
		super();
	}   
	public String getTraceId() {
		return this.traceId;
	}

	public void setTraceId(String traceId) {
		this.traceId = traceId;
	}   
	public String getToken() {
		return this.token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
   
}
