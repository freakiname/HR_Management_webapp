package com.example.demo.abstracts;

import java.util.List;
import java.util.UUID;
import com.example.demo.dto.LeaveRequestCreate;
import com.example.demo.dto.LeaveRequestUpdate;
import com.example.demo.model.LeaveRequest;

public interface LeaveRequestService {
    LeaveRequest CreateOne(LeaveRequestCreate leaveRequestCreate, UUID employeeId);
    List<LeaveRequest> findAllByEmployeeId(UUID employeeId);
    LeaveRequest UpdateOne(UUID leaveRequestId, LeaveRequestUpdate leaveRequestUpdate);
}
    