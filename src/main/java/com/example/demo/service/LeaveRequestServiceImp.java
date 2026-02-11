package com.example.demo.service;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.abstracts.LeaveRequestService;
import com.example.demo.dto.LeaveRequestCreate;
import com.example.demo.dto.LeaveRequestUpdate;
import com.example.demo.model.Employee;
import com.example.demo.model.LeaveRequest;
import com.example.demo.repository.EmployeeRepo;
import com.example.demo.repository.LeaveRequestRepo;

@Service
public class LeaveRequestServiceImp implements LeaveRequestService {
    @Autowired
    LeaveRequestRepo leaveRequestRepo;
    @Autowired
    EmployeeRepo employeeRepo;

    // create leave_request
    public LeaveRequest CreateOne(LeaveRequestCreate leaveRequestCreate, UUID employeeId){
        Employee employee = employeeRepo.findById(employeeId)
        .orElseThrow(() -> new RuntimeException("employee with id " + employeeId + " not found"));
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStartDate(leaveRequestCreate.startDate());
        leaveRequest.setEndDate(leaveRequestCreate.endDate());
        leaveRequest.setReason(leaveRequestCreate.reason());
        // Si le statut n'est pas fourni, définir "PENDING" par défaut
        String status = leaveRequestCreate.status() != null && !leaveRequestCreate.status().isEmpty() 
            ? leaveRequestCreate.status() 
            : "PENDING";
        leaveRequest.setStatus(status);
        leaveRequest.setEmployee(employee);
        return leaveRequestRepo.save(leaveRequest);
    }

    // return all leave_requests
    public List<LeaveRequest> findAllByEmployeeId(UUID employeeId){
        return leaveRequestRepo.findAllByEmployeeId(employeeId);
    }

    // update leave_request
    public LeaveRequest UpdateOne(UUID leaveRequestId, LeaveRequestUpdate leaveRequestUpdate){
        LeaveRequest leaveRequest = leaveRequestRepo.findById(leaveRequestId)
            .orElseThrow(() -> new RuntimeException("leave request with id " + leaveRequestId + " not found"));
        
        leaveRequest.setStartDate(leaveRequestUpdate.startDate());
        leaveRequest.setEndDate(leaveRequestUpdate.endDate());
        leaveRequest.setReason(leaveRequestUpdate.reason());
        
        // Si le statut est fourni, le mettre à jour (sinon garder l'ancien)
        if (leaveRequestUpdate.status() != null && !leaveRequestUpdate.status().isEmpty()) {
            leaveRequest.setStatus(leaveRequestUpdate.status());
        }
        
        return leaveRequestRepo.save(leaveRequest);
    }
}
