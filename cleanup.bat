@echo off
cd /d C:\Projects\qisas-app
git add -A
git commit -m "chore: remove temp commit helper files"
git push origin main --tags
echo DONE:%ERRORLEVEL%
