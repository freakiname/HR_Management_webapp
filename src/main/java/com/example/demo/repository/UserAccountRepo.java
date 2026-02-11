package com.example.demo.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.model.UserAccount;

@Repository
public interface UserAccountRepo extends JpaRepository<UserAccount,UUID>{
    // méthode pour chercher un utilisateur par nom d'utilisateur
    Optional<UserAccount> findByUsername(String username);
    
    // méthode pour chercher un compte utilisateur par employé
    Optional<UserAccount> findByEmployee(com.example.demo.model.Employee employee);
    
    @Query("""
      SELECT COUNT(u) > 0 FROM UserAccount u
      WHERE u.username = :username AND u.employee.id = :employeeId
      """)
    public boolean isOwner(@Param("username") String username, @Param("employeeId") UUID employeeId);
    
}
