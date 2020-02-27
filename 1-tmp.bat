@echo off
net start LmHosts
net start lanmanworkstation
net use K:  /del /y
net use K: \\192.168.153.65\ndfs /user:Edbox Edboxdx

if not "%errorlevel%" == "0" (
	pause
	exit
)
explorer.exe ::{20D04FE0-3AEA-1069-A2D8-08002B30309D}; 
exit