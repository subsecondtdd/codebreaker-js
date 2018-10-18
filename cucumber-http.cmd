@echo off
set SESSION=ControllerSession
set CONTROLLER=HttpCodebreaker
node_modules\.bin\cucumber-js %*
