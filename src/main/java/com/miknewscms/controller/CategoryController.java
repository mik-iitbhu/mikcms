package com.miknewscms.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.miknewscms.model.Category;
import com.miknewscms.model.User;
import com.miknewscms.repository.CategoryRepository;


@RestController
public class CategoryController {

	@Autowired
	CategoryRepository dao;


	@RequestMapping(value="/secure/admin/categories")
	public @ResponseBody List<Category> getAllCat(){
		List<Category> response = dao.findAll();
		return response;
	}
	
	@RequestMapping(value="/secure/admin/categories/{id}")
	public @ResponseBody Category getCat(@PathVariable Long id, HttpServletResponse response) throws IOException{
		return  dao.findOne(id);		
	}
	
	
	
	@RequestMapping(value="/secure/admin/categories", method = RequestMethod.POST)
	public @ResponseBody Category addCat(@RequestBody Category req, HttpServletResponse response) throws IOException{	
				
		if(dao.findByName(req.getName())!= null){
			response.sendError( HttpServletResponse.SC_BAD_REQUEST, "Duplicate name" );
			return null;
		}
		req.setCreateDate(new Date());
		return dao.save(req);
	}
	
	@RequestMapping(value="/secure/admin/categories/{id}", method = RequestMethod.PUT)
	public @ResponseBody Category editCat(@RequestBody Category req, HttpServletResponse response) throws IOException{	
		Category cat = dao.findOne(req.getId());
		if(cat!=null && !cat.getName().equalsIgnoreCase(req.getName()) && dao.findByName(req.getName())!=null){
			response.sendError( HttpServletResponse.SC_BAD_REQUEST, "Duplicate name" );
			return null;
		}
		req.setUpdateDate(new Date());
		return dao.save(req);
	}
	
	@RequestMapping(value="/secure/admin/categories/{id}", method = RequestMethod.DELETE)
	public @ResponseBody User deleteCat(@PathVariable Long id){		
		Category cat = dao.findOne(id);
		dao.delete(cat);	
		return null; 
	}

	
}
