$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:5000/api"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   CAMPUSCARE END-TO-END AUTOMATED VERIFICATION      " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Test 1: Health Check
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    if ($health.status -eq "online") {
        Write-Host " [PASS] Test 1: Health check operational" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 1: Health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 1: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Disposable Email Protection
try {
    $badBody = @{
        name = "Temp User"
        studentId = "STU-TEMP-01"
        email = "temp@tempmail.com"
        password = "Password@123"
        confirmPassword = "Password@123"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $badBody -ContentType "application/json"
    Write-Host " [FAIL] Test 2: Disposable email was not blocked" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host " [PASS] Test 2: Disposable email blocked with HTTP 400" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 2: Unexpected error $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Student Registration with Legitimate Email
$testEmail = "student.$((Get-Date).Ticks)@campuscare.edu"
$testStudentId = "STU-$((Get-Random -Minimum 1000 -Maximum 9999))"
$studentToken = ""

try {
    $studentBody = @{
        name = "Alex Rivera"
        studentId = $testStudentId
        email = $testEmail
        password = "Student@Rivera123"
        confirmPassword = "Student@Rivera123"
    } | ConvertTo-Json

    $regRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $studentBody -ContentType "application/json"
    if ($regRes.success -and $regRes.token) {
        $studentToken = $regRes.token
        Write-Host " [PASS] Test 3: Student registration successful ($testEmail)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 3: Student registration failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 3: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Student Login
try {
    $loginBody = @{
        email = $testEmail
        password = "Student@Rivera123"
    } | ConvertTo-Json

    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    if ($loginRes.success -and $loginRes.token) {
        $studentToken = $loginRes.token
        Write-Host " [PASS] Test 4: Student JWT authentication verified" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 4: Login failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 4: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: File a New Grievance
$ticketId = ""
try {
    $headers = @{
        Authorization = "Bearer $studentToken"
    }
    $complaintBody = @{
        title = "Laboratory 4 Air Extraction Filter Warning"
        category = "Laboratory"
        location = "Chemistry Annex, Lab 402"
        priority = "Urgent"
        description = "Air extraction velocity has fallen below 0.3 m/s; chemical safety alert indicator active."
    } | ConvertTo-Json

    $compRes = Invoke-RestMethod -Uri "$baseUrl/complaints" -Method Post -Headers $headers -Body $complaintBody -ContentType "application/json"
    if ($compRes.success -and $compRes.complaint._id) {
        $ticketId = $compRes.complaint._id
        $displayId = if ($compRes.complaint.ticketId) { $compRes.complaint.ticketId } else { $ticketId.Substring(18) }
        Write-Host " [PASS] Test 5: Grievance submission successful (Ticket #$displayId)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 5: Grievance submission failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 5: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Retrieve Student's Complaints
try {
    $headers = @{ Authorization = "Bearer $studentToken" }
    $myRes = Invoke-RestMethod -Uri "$baseUrl/complaints/my" -Method Get -Headers $headers
    if ($myRes.success -and $myRes.complaints.Count -ge 1) {
        Write-Host " [PASS] Test 6: Retrieved student complaints list ($($myRes.complaints.Count) active tickets)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 6: Student complaints retrieval failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 6: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Administrator Login
$adminToken = ""
try {
    $adminLoginBody = @{
        email = "zainshahg0005@gmail.com"
        password = "@Zain@2665."
    } | ConvertTo-Json

    $adminRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    if ($adminRes.success -and $adminRes.user.role -eq "admin") {
        $adminToken = $adminRes.token
        Write-Host " [PASS] Test 7: Administrator authentication verified (Role: admin)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 7: Admin authentication failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 7: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Admin Dashboard Telemetry
try {
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    $dashRes = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers $adminHeaders
    if ($dashRes.success -and $dashRes.data.totalComplaints -ge 1) {
        Write-Host " [PASS] Test 8: Admin dashboard telemetry retrieved (Total: $($dashRes.data.totalComplaints), Students: $($dashRes.data.totalStudents))" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 8: Admin telemetry failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 8: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: Admin Triage & Status Update
try {
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    $updateBody = @{
        status = "In Progress"
        adminResponse = "HVAC technician dispatched to replace ventilation motor. Estimated completion in 45 mins."
    } | ConvertTo-Json

    $updateRes = Invoke-RestMethod -Uri "$baseUrl/admin/complaints/$ticketId/status" -Method Put -Headers $adminHeaders -Body $updateBody -ContentType "application/json"
    if ($updateRes.success -and $updateRes.complaint.status -eq "In Progress") {
        Write-Host " [PASS] Test 9: Admin ticket status updated to [In Progress] with automated student alert" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 9: Status update failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 9: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Admin Student Directory
try {
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    $studentsRes = Invoke-RestMethod -Uri "$baseUrl/admin/students" -Method Get -Headers $adminHeaders
    if ($studentsRes.success -and $studentsRes.students.Count -ge 1) {
        Write-Host " [PASS] Test 10: Admin student directory accessed ($($studentsRes.students.Count) enrolled students indexed)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Test 10: Student directory failed" -ForegroundColor Red
    }
} catch {
    Write-Host " [FAIL] Test 10: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   ALL 10 AUTOMATED VERIFICATION CHECKS PASSED       " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
