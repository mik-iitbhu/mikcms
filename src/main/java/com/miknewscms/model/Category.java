

package com.miknewscms.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.google.appengine.datanucleus.annotations.Unowned;


/**
 * @author Ishahaq Khan
 */

@Entity
public class Category implements Serializable {

	private static final long serialVersionUID = 4L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String name;
	private String description;
	private String seoUrl;
	private String metaKeyword;
	private String metaDescription;
	
    private String parent;

	private boolean disabled;
	private Date createDate;
	private Date updateDate;
	

	public Category() {
		disabled = false;
	}
	
	
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long aId) {
		id = aId;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	


	public Date getCreateDate() {
		return createDate;
	}




	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}




	public Date getUpdateDate() {
		return updateDate;
	}




	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}



	public String getParent() {
		return parent;
	}



	public void setParent(String parent) {
		this.parent = parent;
	}



	public String getDescription() {
		return description;
	}



	public void setDescription(String description) {
		this.description = description;
	}



	public String getSeoUrl() {
		return seoUrl;
	}



	public void setSeoUrl(String seoUrl) {
		this.seoUrl = seoUrl;
	}



	public String getMetaKeyword() {
		return metaKeyword;
	}



	public void setMetaKeyword(String metaKeyword) {
		this.metaKeyword = metaKeyword;
	}



	public String getMetaDescription() {
		return metaDescription;
	}



	public void setMetaDescription(String metaDescription) {
		this.metaDescription = metaDescription;
	}
	
}
