package com.example.demo.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.abstracts.EmployeeService;
import com.example.demo.dto.EmployeeCreate;
import com.example.demo.dto.EmployeeUpdate;
import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.demo.repository.UserAccountRepo;
import com.example.demo.model.UserAccount;
import java.util.Optional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    @Autowired
    EmployeeService employeeService;
    @Autowired
    EmployeeRepo employeeRepo;
    @Autowired
    UserAccountRepo userAccountRepo;

    @PostMapping
    public Employee CreateOne(@RequestBody @Valid EmployeeCreate employeeCreate){
        Employee employee = employeeService.CreateOne(employeeCreate);
        return employee;
    }

    @GetMapping
    public List<Employee> findAllEmployees(){
        List<Employee> employees = employeeService.findAllEmployees();
        return employees;
    }

    @GetMapping("/me")
    public Employee getCurrentEmployee(){
        // Récupérer le username depuis le SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Récupérer le UserAccount
        Optional<UserAccount> userAccountOpt = userAccountRepo.findByUsername(username);
        if (userAccountOpt.isEmpty()) {
            throw new RuntimeException("User account not found");
        }
        
        UserAccount userAccount = userAccountOpt.get();
        Employee employeeProxy = userAccount.getEmployee();
        
        // Récupérer l'employé directement depuis le repository pour éviter les problèmes de proxy Hibernate
        UUID employeeId = employeeProxy.getId();
        return employeeRepo.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @DeleteMapping("/{id}")
    public String DeleteOne(@PathVariable UUID id){
        employeeService.DeleteOne(id);
        return "\"L'employé a été supprimé avec succès !\"";
    }

    @PutMapping("/{id}")
    Employee UpdateOne(@PathVariable UUID id, @RequestBody EmployeeUpdate EmployeeUpdate){
        Employee employee = employeeService.UpdateOne(id, EmployeeUpdate);
        return employee;
    }
}
