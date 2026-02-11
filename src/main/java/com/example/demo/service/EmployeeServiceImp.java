package com.example.demo.service;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.abstracts.EmployeeService;
import com.example.demo.dto.EmployeeCreate;
import com.example.demo.dto.EmployeeUpdate;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.model.LeaveRequest;
import com.example.demo.repository.DepartmentRepo;
import com.example.demo.repository.EmployeeRepo;
import com.example.demo.repository.LeaveRequestRepo;
import com.example.demo.repository.UserAccountRepo;

@Service
public class EmployeeServiceImp implements EmployeeService{
    @Autowired
    EmployeeRepo employeeRepo;
    @Autowired
    DepartmentRepo departmentRepo;
    @Autowired
    EmailService emailService;
    @Autowired
    UserAccountRepo userAccountRepo;
    @Autowired
    LeaveRequestRepo leaveRequestRepo;

    // create employee
    @Transactional
    public Employee CreateOne(EmployeeCreate employeeCreate) {
        // Vérifier que le département existe
        Department department = departmentRepo.findById(employeeCreate.departmentId())
            .orElseThrow(() -> new RuntimeException(
                "Department with id " + employeeCreate.departmentId() + " not found"
            ));

        // Créer un nouvel employé
        Employee employee = new Employee();

        // Générer un token unique pour la création de compte
        String token = UUID.randomUUID().toString();

        // Remplir les champs
        employee.setFirstName(employeeCreate.firstName());
        employee.setLastName(employeeCreate.lastName());
        employee.setHireDate(employeeCreate.hireDate());
        employee.setEmail(employeeCreate.email());
        employee.setPhone(employeeCreate.phone());
        employee.setPosition(employeeCreate.position());
        employee.setDepartment(department);
        employee.setVerified(false); // le compte utilisateur n’est pas encore activé
        employee.setAccountCreationToken(token); // on garde le token en base


        // Sauvegarder l’employé dans la base
        Employee savedEmployee = employeeRepo.save(employee);
        // Envoyer l’email APRÈS la sauvegarde
        emailService.sendAccountCreationEmail(employee.getEmail(), token);
         return savedEmployee;
    }


    // update employee
    public Employee UpdateOne(UUID id, EmployeeUpdate employeeUpdate){
        Employee employee = employeeRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("employee with id " + id + " not found"));
        employee.setFirstName(employeeUpdate.firstName());
        employee.setLastName(employeeUpdate.lastName());
        employee.setPhone(employeeUpdate.phone());
        employee.setPosition(employeeUpdate.position());
        return employeeRepo.save(employee);
    }

    // find all employees
    public List<Employee> findAllEmployees(){
        return employeeRepo.findAll();
    }

    // delete employee
    @Transactional
    public String DeleteOne(UUID id){
        Employee employee = employeeRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("employee with id " + id + " not found"));
        
        // Supprimer toutes les demandes de congé associées
        List<LeaveRequest> leaveRequests = leaveRequestRepo.findAllByEmployeeId(id);
        if (!leaveRequests.isEmpty()) {
            leaveRequestRepo.deleteAll(leaveRequests);
        }
        
        // Supprimer le compte utilisateur associé s'il existe
        userAccountRepo.findByEmployee(employee).ifPresent(userAccount -> {
            userAccountRepo.delete(userAccount);
        });
        
        // Supprimer l'employé
        employeeRepo.delete(employee);
        
        return "L'employé, son compte utilisateur et ses demandes de congé ont été supprimés avec succès !";
    }
}
