@echo off
cd /d C:\Projects\qisas-app
git add -A
git commit -m "test(security): Phase 2C-B — 28 static regression tests for stories.ts security gate"
git push origin main --tags
echo DONE:%ERRORLEVEL%
