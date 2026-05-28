@echo off
cd /d C:\Projects\qisas-app
git add -A
git commit -m "chore: remove temp do_commit.bat"
git push origin main
echo DONE:%ERRORLEVEL%
