#!/bin/bash
cd /home/kavia/workspace/code-generation/career-connect-platform-41644-41653/job_searching_platform_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

