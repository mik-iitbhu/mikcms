

package com.miknewscms.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


/**
 * @author Ishahaq Khan
 */

@Entity
public class Post implements Serializable {

	private static final long serialVersionUID = 4L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String title;
	private String content;
	private String seoUrl;
	private String metaKeyword;
	private String metaDescription;
	private boolean disabled;
	private Date createDate;
	private Date updateDate;
	

	public Post() {
		disabled = false;
	}
	
	
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long aId) {
		id = aId;
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



	public String getTitle() {
		return title;
	}



	public void setTitle(String title) {
		this.title = title;
	}



	public String getContent() {
		return content;
	}



	public void setContent(String content) {
		this.content = content;
	}
	
}
