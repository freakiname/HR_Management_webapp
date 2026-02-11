package com.example.demo.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.LeaveRequest;

@Repository
public interface LeaveRequestRepo extends JpaRepository<LeaveRequest,UUID>{
    List<LeaveRequest> findAllByEmployeeId(UUID employeeId);
}
