package com.example.demo.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.abstracts.DepartmentService;
import com.example.demo.dto.DepartmentCreate;
import com.example.demo.dto.DepartmentUpdate;
import com.example.demo.model.Department;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/departments")
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;

    // Créer un département
    @PostMapping("/create-department")
    public Department createOne(@Valid @RequestBody DepartmentCreate departmentCreate) {
        return departmentService.createOne(departmentCreate);
    }

    
     // Afficher tous les départements
    @GetMapping("/list-departments")
    public List<Department> findAllDepartments() {
        return departmentService.findAllDepartments();
    }

    // Supprimer un département
    @DeleteMapping("/{id}")
    public String deleteOne(@PathVariable UUID id) {
        return departmentService.deleteOne(id);
    }

    // Mettre à jour un département
    @PutMapping("/edit/{id}")
    public Department updateOne(@PathVariable UUID id, @Valid @RequestBody DepartmentUpdate departmentUpdate) {
        return departmentService.updateOne(id, departmentUpdate);
    }

    


    // Récupérer un département par ID
    @GetMapping("/view/{id}")
    public Department viewDepartment(@PathVariable UUID id) {
        return departmentService.findById(id);
    }
}
