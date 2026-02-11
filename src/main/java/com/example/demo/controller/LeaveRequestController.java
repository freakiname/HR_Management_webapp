package com.example.demo.controller;


import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.abstracts.LeaveRequestService;
import com.example.demo.dto.LeaveRequestCreate;
import com.example.demo.dto.LeaveRequestUpdate;
import com.example.demo.model.LeaveRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/leaveRequests")
public class LeaveRequestController {
    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/{employeeId}")
    LeaveRequest CreateOne(@RequestBody @Valid LeaveRequestCreate leaveRequestCreate,@PathVariable UUID employeeId){
        LeaveRequest leaveRequest = leaveRequestService.CreateOne(leaveRequestCreate, employeeId);
        return leaveRequest;
    }

    @GetMapping("/{employeeId}")
    List<LeaveRequest> findAllByEmployeeId(@PathVariable UUID employeeId){
        List<LeaveRequest> leaveRequests = leaveRequestService.findAllByEmployeeId(employeeId);
        return leaveRequests;
    }

    @PutMapping("/{leaveRequestId}")
    LeaveRequest UpdateOne(@PathVariable UUID leaveRequestId, @RequestBody @Valid LeaveRequestUpdate leaveRequestUpdate){
        LeaveRequest leaveRequest = leaveRequestService.UpdateOne(leaveRequestId, leaveRequestUpdate);
        return leaveRequest;
    }
}
