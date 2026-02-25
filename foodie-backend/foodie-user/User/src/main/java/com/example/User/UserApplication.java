package com.example.User;

import com.example.User.security.JwtAuthenticationFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UserApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserApplication.class, args);
	}
//	@Bean
//	public FilterRegistrationBean filterBean(){
//		FilterRegistrationBean frb=new FilterRegistrationBean();
//		frb.setFilter(new JwtAuthenticationFilter());
//		frb.addUrlPatterns("/users/me");
//		return frb;
//	}

}
