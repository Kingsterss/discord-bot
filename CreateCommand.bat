@echo off 
setlocal EnableExtensions DisableDelayedExpansion

set /p ComName=Name:
set "name=%ComName%"

set /p ComCommands=Commands:
set "commands=%ComCommands%"

set /p ComArgs=Args:
set "args=%ComArgs%"

set /p ComDescription=Description:
set "description=%ComDescription%"

set "newCommandFile=commands/%name%.js"

echo module.exports = { >> "%newCommandFile%"
echo name: '%name%', >> "%newCommandFile%"
echo commands: ['%commands%'], >> "%newCommandFile%"
echo args: ['%args%'], >> "%newCommandFile%"
echo description: '%description%', >> "%newCommandFile%"
echo async execute(message, args, serverQueue, Discord, prefix) { >> "%newCommandFile%"
echo }>> "%newCommandFile%"
echo }>> "%newCommandFile%"

endlocal