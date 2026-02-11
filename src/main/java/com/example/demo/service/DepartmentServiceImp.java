package com.example.demo.service;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.abstracts.DepartmentService;
import com.example.demo.dto.DepartmentCreate;
import com.example.demo.dto.DepartmentUpdate;
import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepo;

@Service
public class DepartmentServiceImp implements DepartmentService{
    @Autowired
    DepartmentRepo departmentRepo;

    // create department
    public Department createOne(DepartmentCreate departmentCreate){
        Department department = new Department();
        department.setName(departmentCreate.name());
        return departmentRepo.save(department);
    }

    // update department
    public Department updateOne(UUID id,DepartmentUpdate departmentUpdate){
        Department department = departmentRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Department with id " + id + " not found"));
        department.setName(departmentUpdate.name());
        return departmentRepo.save(department);
    }

    // find all departments
    public List<Department> findAllDepartments(){
        return departmentRepo.findAll();
    }

    // delete department
    public String deleteOne(UUID id){
        if(departmentRepo.existsById(id)){
            departmentRepo.deleteById(id);
            return "Le département a été supprimé avec succès !";
        }
        else{
            throw new RuntimeException("Department with id " + id + " not found");
        }
    }


    @Override
    public Department findById(UUID id) {
        // Exemple avec un repository JPA
        return departmentRepo.findById(id).orElseThrow(() -> new RuntimeException("Département non trouvé"));
    }

}
