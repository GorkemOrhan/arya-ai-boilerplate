# Cleanup script to remove exam-specific files and folders
Write-Host "Starting cleanup process..."

# Backend cleanup
Write-Host "Cleaning up backend..."

# Remove exam-specific models
if (Test-Path "backend/app/models/exam.py") { Remove-Item "backend/app/models/exam.py" }
if (Test-Path "backend/app/models/question.py") { Remove-Item "backend/app/models/question.py" }
if (Test-Path "backend/app/models/candidate.py") { Remove-Item "backend/app/models/candidate.py" }
if (Test-Path "backend/app/models/result.py") { Remove-Item "backend/app/models/result.py" }

# Remove exam-specific API routes
if (Test-Path "backend/app/api/exams.py") { Remove-Item "backend/app/api/exams.py" }
if (Test-Path "backend/app/api/questions.py") { Remove-Item "backend/app/api/questions.py" }
if (Test-Path "backend/app/api/candidates.py") { Remove-Item "backend/app/api/candidates.py" }
if (Test-Path "backend/app/api/results.py") { Remove-Item "backend/app/api/results.py" }

# Update test.py to remove references to deleted models
if (Test-Path "backend/app/api/test.py") {
    Write-Host "Updating test.py to remove references to deleted models..."
    $content = Get-Content "backend/app/api/test.py" -Raw
    $content = $content -replace "from ..models.exam import Exam`r`n", ""
    $content = $content -replace "from ..models.candidate import Candidate`r`n", ""
    $content = $content -replace "from ..models.question import Question`r`n", ""
    $content = $content -replace "from ..models.result import Result`r`n", ""
    $content = $content -replace "'exams': Exam.query.count\(\),`r`n\s+'candidates': Candidate.query.count\(\),`r`n\s+'questions': Question.query.count\(\),`r`n\s+'results': Result.query.count\(\)", ""
    Set-Content "backend/app/api/test.py" $content
}

# Frontend cleanup
Write-Host "Cleaning up frontend..."

# Remove exam-specific pages
if (Test-Path "frontend/pages/exams") { Remove-Item "frontend/pages/exams" -Recurse }
if (Test-Path "frontend/pages/admin/exams") { Remove-Item "frontend/pages/admin/exams" -Recurse }
if (Test-Path "frontend/pages/admin/questions") { Remove-Item "frontend/pages/admin/questions" -Recurse }
if (Test-Path "frontend/pages/admin/candidates") { Remove-Item "frontend/pages/admin/candidates" -Recurse }
if (Test-Path "frontend/pages/admin/results") { Remove-Item "frontend/pages/admin/results" -Recurse }

# Remove exam-specific API services
if (Test-Path "frontend/api/services/exams.js") { Remove-Item "frontend/api/services/exams.js" }
if (Test-Path "frontend/api/services/questions.js") { Remove-Item "frontend/api/services/questions.js" }
if (Test-Path "frontend/api/services/candidates.js") { Remove-Item "frontend/api/services/candidates.js" }
if (Test-Path "frontend/api/services/results.js") { Remove-Item "frontend/api/services/results.js" }

# Make sure user management and settings folders exist
if (-Not (Test-Path "frontend/pages/admin/users")) { 
    New-Item -Path "frontend/pages/admin/users" -ItemType Directory
    Write-Host "Created users directory in admin section"
}

if (-Not (Test-Path "frontend/pages/admin/settings")) { 
    New-Item -Path "frontend/pages/admin/settings" -ItemType Directory 
    Write-Host "Created settings directory in admin section"
}

Write-Host "Cleanup complete!"
Write-Host "The project has been converted to a base boilerplate with account management features."
Write-Host "You can now extend it with your own custom features." 