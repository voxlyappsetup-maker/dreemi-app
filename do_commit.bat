@echo off
cd /d C:\Projects\qisas-app
git add -A
git commit -m "test(safety): Phase 2C-A — 46 unit tests for checkSafety via Node built-in runner"
echo COMMIT_EXIT:%ERRORLEVEL%
git push origin main --tags
echo PUSH_EXIT:%ERRORLEVEL%
