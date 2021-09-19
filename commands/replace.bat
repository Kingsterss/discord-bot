@echo off 
setlocal EnableExtensions DisableDelayedExpansion

set /p findThis=Find:
set "search=%findThis%"
set /p replaceThis=Replace:
set "replace=%replaceThis%"
set /p atFiles=At Files: .
set "fileExt=%atFiles%"
set "textFile=*%atFiles%"
set "outputFile=history.txt"

set "rootDir=."

for %%j in ("%rootDir%\%textFile%") do (
    for /f "delims=" %%i in ('type "%%~j" ^& break ^> "%%~j"') do (
        set "line=%%i"
        setlocal EnableDelayedExpansion
        set "line=!line:%search%=%replace%!"
        >>"%%~j" echo(!line!
        endlocal
    )
)

echo [%date%-%time%] Replaced "%search%" with "%replace%" in every .%fileExt% files>> "%outputFile%"

endlocal