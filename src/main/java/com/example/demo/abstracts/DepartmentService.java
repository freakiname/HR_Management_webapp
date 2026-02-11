package com.example.demo.abstracts;

import java.util.List;
import java.util.UUID;
import com.example.demo.dto.DepartmentCreate;
import com.example.demo.dto.DepartmentUpdate;
import com.example.demo.model.Department;

public interface DepartmentService {
    Department createOne(DepartmentCreate departmentCreate);
    Department updateOne(UUID id,DepartmentUpdate departmentUpdate);
    List<Department> findAllDepartments();
    String deleteOne(UUID id);
    Department findById(UUID id);
}
