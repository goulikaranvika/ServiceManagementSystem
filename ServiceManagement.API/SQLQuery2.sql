DELETE FROM TechnicianAssignments 
WHERE AssignedBy NOT IN (SELECT UserId FROM Users);
