@echo off
echo Making user an admin...
cd ..
node --experimental-modules scripts/makeAdmin.js %1
echo Done!
