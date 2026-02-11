package com.example.demo.abstracts;

import java.util.List;
import java.util.UUID;
import com.example.demo.dto.EmployeeCreate;
import com.example.demo.dto.EmployeeUpdate;
import com.example.demo.model.Employee;

public interface EmployeeService {
    Employee CreateOne(EmployeeCreate employeeCreate);
    Employee UpdateOne(UUID id, EmployeeUpdate EmployeeUpdate);
    List<Employee> findAllEmployees();
    String DeleteOne(UUID id);
}
