#!/bin/bash

# Cleanup script to remove exam-specific files and folders
echo "Starting cleanup process..."

# Backend cleanup
echo "Cleaning up backend..."

# Remove exam-specific models
rm -f backend/app/models/exam.py
rm -f backend/app/models/question.py
rm -f backend/app/models/candidate.py
rm -f backend/app/models/result.py

# Remove exam-specific API routes
rm -f backend/app/api/exams.py
rm -f backend/app/api/questions.py
rm -f backend/app/api/candidates.py
rm -f backend/app/api/results.py

# Update test.py to remove references to deleted models
if [ -f backend/app/api/test.py ]; then
    echo "Updating test.py to remove references to deleted models..."
    # Remove import statements for deleted models
    sed -i '/from ..models.exam import Exam/d' backend/app/api/test.py
    sed -i '/from ..models.candidate import Candidate/d' backend/app/api/test.py
    sed -i '/from ..models.question import Question/d' backend/app/api/test.py
    sed -i '/from ..models.result import Result/d' backend/app/api/test.py
    
    # Replace the stats dictionary with only users
    sed -i "s/'users': User.query.count(),\\n        'exams': Exam.query.count(),\\n        'candidates': Candidate.query.count(),\\n        'questions': Question.query.count(),\\n        'results': Result.query.count()/'users': User.query.count()/g" backend/app/api/test.py
fi

# Frontend cleanup
echo "Cleaning up frontend..."

# Remove exam-specific pages
rm -rf frontend/pages/exams
rm -rf frontend/pages/admin/exams
rm -rf frontend/pages/admin/questions
rm -rf frontend/pages/admin/candidates
rm -rf frontend/pages/admin/results

# Remove exam-specific API services
rm -f frontend/api/services/exams.js
rm -f frontend/api/services/questions.js
rm -f frontend/api/services/candidates.js
rm -f frontend/api/services/results.js

# Make sure user management and settings folders exist
if [ ! -d frontend/pages/admin/users ]; then
    mkdir -p frontend/pages/admin/users
    echo "Created users directory in admin section"
fi

if [ ! -d frontend/pages/admin/settings ]; then
    mkdir -p frontend/pages/admin/settings
    echo "Created settings directory in admin section"
fi

echo "Cleanup complete!"
echo "The project has been converted to a base boilerplate with account management features."
echo "You can now extend it with your own custom features." 