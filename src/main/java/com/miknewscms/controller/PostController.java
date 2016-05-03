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

import com.miknewscms.model.Post;
import com.miknewscms.model.User;
import com.miknewscms.repository.PostRepository;


@RestController
public class PostController {

	@Autowired
	PostRepository dao;


	@RequestMapping(value="/secure/admin/posts")
	public @ResponseBody List<Post> getAllPost(){
		List<Post> response = dao.findAll();
		return response;
	}
	
	@RequestMapping(value="/secure/admin/posts/{id}")
	public @ResponseBody Post getPost(@PathVariable Long id, HttpServletResponse response) throws IOException{
		return  dao.findOne(id);		
	}
	
	
	
	@RequestMapping(value="/secure/admin/posts", method = RequestMethod.POST)
	public @ResponseBody Post addPost(@RequestBody Post req, HttpServletResponse response) throws IOException{	
				
		if(dao.findByTitle(req.getTitle())!= null){
			response.sendError( HttpServletResponse.SC_BAD_REQUEST, "DupliPoste name" );
			return null;
		}
		req.setCreateDate(new Date());
		return dao.save(req);
	}
	
	@RequestMapping(value="/secure/admin/posts/{id}", method = RequestMethod.PUT)
	public @ResponseBody Post editPost(@RequestBody Post req, HttpServletResponse response) throws IOException{	
		Post Post = dao.findOne(req.getId());
		if(Post!=null && !Post.getTitle().equalsIgnoreCase(req.getTitle()) && dao.findByTitle(req.getTitle())!=null){
			response.sendError( HttpServletResponse.SC_BAD_REQUEST, "DupliPoste name" );
			return null;
		}
		req.setUpdateDate(new Date());
		return dao.save(req);
	}
	
	@RequestMapping(value="/secure/admin/posts/{id}", method = RequestMethod.DELETE)
	public @ResponseBody User deletePost(@PathVariable Long id){		
		Post Post = dao.findOne(id);
		dao.delete(Post);	
		return null; 
	}

	
}
