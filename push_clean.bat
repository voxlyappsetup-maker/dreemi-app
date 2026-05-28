@echo off
cd /d C:\Projects\qisas-app
git rm --cached commit_msg.txt do_commit.bat 2>nul
del commit_msg.txt 2>nul
del do_commit.bat 2>nul
git add -A
git commit -m "chore: remove temp commit helper files"
git push origin main --tags
echo PUSH_EXIT:%ERRORLEVEL%
