package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.UserAccountRepo;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class UserDetailsServiceImp implements UserDetailsService{
    @Autowired
    private UserAccountRepo userAccountRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserAccount> account = userAccountRepo.findByUsername(username);
        if(account.isEmpty()){
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        UserAccount user = account.get();

        return User.builder()
        .username(user.getUsername())
        .password(user.getPassword())
        .roles(user.getRole())
        .build();
    }
    
}
