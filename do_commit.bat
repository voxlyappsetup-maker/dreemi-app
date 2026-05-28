@echo off
cd /d C:\Projects\qisas-app
git add -A
git commit -F commit_msg.txt
echo COMMIT_EXIT:%ERRORLEVEL%
