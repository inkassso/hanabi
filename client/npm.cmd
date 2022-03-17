@echo off
setlocal enabledelayedexpansion

set "tempFile=%~dpn0.tmp"
set "localNpm=node_modules\.bin\npm.cmd"

if exist "%localNpm%" (
  "%localNpm%" %*
) else (
  where npm > "%tempFile%"
  for /f "delims= eol=" %%a in (%tempFile%) do (
    if not "%%a" == "%~dpnx0" (
      set "npmPath=%%a"
      goto :runNpm
    )
  )
  echo ERROR^^! Global NPM not found >&2
  del /q "%tempFile%"
  exit /b 1
  :runNpm
  del /q "%tempFile%"
  echo WARNING^^! Local NPM not found, using global NPM: !npmPath! >&2
  "!npmPath!" %*
)
