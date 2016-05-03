package com.miknewscms.controller;

import io.jsonwebtoken.Jwts;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.miknewscms.domains.LoginResponse;
import com.miknewscms.domains.UserReq;
import com.miknewscms.model.User;
import com.miknewscms.repository.UserRepository;
import com.miknewscms.util.PortalConstants;


@RestController
public class UserController {

	@Autowired
	UserRepository dao;
	
	@RequestMapping(value="/admin/login", method = RequestMethod.POST)
	public @ResponseBody LoginResponse login(@RequestBody UserReq req, HttpServletResponse response) throws ServletException, IOException{		
		if(dao.count()==0){
			User user = new User();
			user.setEmail("mik.iitbhu@gmail.com");
			user.setPassword("mik");
			user.setName("Ishaq");
			user.setRole(PortalConstants.SUPERADMIN);
			user.setCreateDate(new Date());
			dao.save(user);
		}
		LoginResponse res = new LoginResponse();
		String email = req.getEmail();
		String password = req.getPassword();
		User user = dao.findByEmail(email);
		if(user == null || !(password).equals(user.getPassword())){	
			response.sendError( HttpServletResponse.SC_UNAUTHORIZED, "Bad credentials" );
			return null;
		}
		res.setToken(Jwts.builder().setSubject(user.getName())
	            .claim("roles", user.getRole()).setIssuedAt(new Date())
	            .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, "secretkey")
	            .setExpiration(new Date(System.currentTimeMillis()+3600000))
	            .compact());
		
		res.setMessage("Authenticated successfully");
		return res;
	}

	@RequestMapping(value="/secure/admin/users")
	public @ResponseBody List<User> getAllUsers(){
		List<User> response = dao.findByRole(PortalConstants.USER);
		return response;
	}
	
	@RequestMapping(value="/secure/admin/users/{id}")
	public @ResponseBody User getUser(@PathVariable Long id, HttpServletResponse response) throws IOException{
		return  dao.findOne(id);		
	}
	
	
	
	@RequestMapping(value="/secure/admin/users", method = RequestMethod.POST)
	public @ResponseBody User addUser(@RequestBody UserReq req, HttpServletResponse response) throws IOException{	
				
		if(dao.findByEmail(req.getEmail())!= null){
			response.sendError( HttpServletResponse.SC_BAD_REQUEST, "Duplicate email" );
			return null;
		}
		String name = req.getName();
		String email = req.getEmail();
		String password = req.getPassword();
		User user = new User();
		user.setName(name);
		user.setEmail(email);
		user.setPassword(password);
		user.setCreateDate(new Date());
		user.setRole(PortalConstants.USER);
		return dao.save(user);
	}
	
	@RequestMapping(value="/secure/admin/users/{id}", method = RequestMethod.PUT)
	public @ResponseBody User editUser(@PathVariable Long id, @RequestBody UserReq req){			
		
		User user = dao.findOne(id);
		
		String email = req.getEmail()!=null?req.getName():user.getEmail();
		String name = req.getName()!=null?req.getName():user.getName();
		String password = req.getPassword()!=null ? req.getPassword():user.getPassword();
		user.setName(name);
		user.setEmail(email);
		user.setPassword(password);		
		return dao.save(user);
	}
	
	@RequestMapping(value="/secure/admin/users/{id}", method = RequestMethod.DELETE)
	public @ResponseBody User deleteUser(@PathVariable Long id){		
		User user = dao.findOne(id);
		dao.delete(user);	
		return null; 
	}

	
}
