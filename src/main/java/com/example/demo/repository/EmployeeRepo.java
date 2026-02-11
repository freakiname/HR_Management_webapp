package com.example.demo.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee,UUID>{
    Optional<Employee> findOneByAccountCreationToken(String token);
}
