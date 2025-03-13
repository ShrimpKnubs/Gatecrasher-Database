@echo off
setlocal enabledelayedexpansion
color 0a
title Improved JSON to TXT Converter

echo ===============================================
echo      IMPROVED JSON TO MISSION CONVERTER
echo ===============================================
echo.
echo This script converts JSON files to mission text
echo files with improved field extraction.
echo.
echo Checking for required files...

:: Check if necessary files exist
if not exist data\missions.json (
    echo ERROR: missions.json not found in data folder!
    echo Please ensure it exists before running this converter.
    echo.
    pause
    exit /b 1
)

:: Create folders if they don't exist
if not exist data\missions mkdir data\missions
if not exist data\images mkdir data\images

echo.
echo Found missions.json
if exist data\intel.json (
    echo Found intel.json
) else (
    echo Intel.json not found. Will create missions without intel data.
)

echo.
echo Beginning conversion...
echo.

:: Create a temporary script file for PowerShell to run
echo $ErrorActionPreference = 'Stop'; > convert_script.ps1
echo try { >> convert_script.ps1
echo     $missions = Get-Content -Raw 'data\missions.json' ^| ConvertFrom-Json; >> convert_script.ps1
echo     $intel = $null; >> convert_script.ps1
echo     if (Test-Path 'data\intel.json') { >> convert_script.ps1
echo         $intel = Get-Content -Raw 'data\intel.json' ^| ConvertFrom-Json; >> convert_script.ps1
echo     } >> convert_script.ps1
echo     foreach ($mission in $missions) { >> convert_script.ps1
echo         $id = $mission.id; >> convert_script.ps1
echo         $name = $mission.name; >> convert_script.ps1
echo         $location = $mission.location; >> convert_script.ps1
echo         $difficulty = $mission.difficulty; >> convert_script.ps1
echo         $payment = $mission.payment; >> convert_script.ps1
echo         $duration = $mission.duration; >> convert_script.ps1
echo         $teamSize = $mission.teamSize; >> convert_script.ps1
echo         $lat = $mission.coordinates.lat; >> convert_script.ps1
echo         $lon = $mission.coordinates.lon; >> convert_script.ps1
echo         $missionImage = ''; >> convert_script.ps1
echo         if ($mission.PSObject.Properties.Name -contains 'image') { >> convert_script.ps1
echo             $missionImage = $mission.image; >> convert_script.ps1
echo         } >> convert_script.ps1
echo         $intelTitle = "$name INTEL"; >> convert_script.ps1
echo         $intelContent = ''; >> convert_script.ps1
echo         $intelImages = ''; >> convert_script.ps1
echo         if ($intel -ne $null -and $intel.PSObject.Properties.Name -contains $id) { >> convert_script.ps1
echo             $intelObj = $intel.$id; >> convert_script.ps1
echo             if ($intelObj.PSObject.Properties.Name -contains 'title') { >> convert_script.ps1
echo                 $intelTitle = $intelObj.title; >> convert_script.ps1
echo             } >> convert_script.ps1
echo             if ($intelObj.PSObject.Properties.Name -contains 'content') { >> convert_script.ps1
echo                 $intelContent = $intelObj.content; >> convert_script.ps1
echo             } >> convert_script.ps1
echo             if ($intelObj.PSObject.Properties.Name -contains 'images' -and $intelObj.images -ne $null -and $intelObj.images.Count -gt 0) { >> convert_script.ps1
echo                 $intelImages = $intelObj.images -join ','; >> convert_script.ps1
echo             } >> convert_script.ps1
echo         } >> convert_script.ps1
echo         $outfile = "data\missions\$id.txt"; >> convert_script.ps1
echo         $content = @(); >> convert_script.ps1
echo         $content += '# ARMA 3 MISSION TEMPLATE'; >> convert_script.ps1
echo         $content += '# Edit the fields below and save the file'; >> convert_script.ps1
echo         $content += '# Use "mission1.txt", "mission2.txt", etc. for filenames'; >> convert_script.ps1
echo         $content += ''; >> convert_script.ps1
echo         $content += '# Basic Mission Information'; >> convert_script.ps1
echo         $content += "ID:$id"; >> convert_script.ps1
echo         $content += "Name:$name"; >> convert_script.ps1
echo         $content += "Location:$location"; >> convert_script.ps1
echo         $content += "Difficulty:$difficulty"; >> convert_script.ps1
echo         $content += "Payment:$payment"; >> convert_script.ps1
echo         $content += "Duration:$duration"; >> convert_script.ps1
echo         $content += "TeamSize:$teamSize"; >> convert_script.ps1
echo         $content += ''; >> convert_script.ps1
echo         $content += '# Coordinates (decimal format)'; >> convert_script.ps1
echo         $content += "Latitude:$lat"; >> convert_script.ps1
echo         $content += "Longitude:$lon"; >> convert_script.ps1
echo         $content += ''; >> convert_script.ps1
echo         $content += '# Mission Image (leave blank if none)'; >> convert_script.ps1
echo         $content += '# Example: mission1.jpg (file must be in data/images folder)'; >> convert_script.ps1
echo         $content += "MissionImage:$missionImage"; >> convert_script.ps1
echo         $content += ''; >> convert_script.ps1
echo         $content += '# Intel Information'; >> convert_script.ps1
echo         $content += "IntelTitle:$intelTitle"; >> convert_script.ps1
echo         $content += "IntelContent:$intelContent"; >> convert_script.ps1
echo         $content += ''; >> convert_script.ps1
echo         $content += '# Intel Images (comma-separated list, leave blank if none)'; >> convert_script.ps1
echo         $content += '# Example: intel1.jpg,intel2.jpg (files must be in data/images folder)'; >> convert_script.ps1
echo         $content += "IntelImages:$intelImages"; >> convert_script.ps1
echo         $outPath = Join-Path -Path (Get-Location) -ChildPath $outfile; >> convert_script.ps1
echo         Out-File -FilePath $outPath -InputObject $content -Encoding utf8; >> convert_script.ps1
echo         Write-Host "Created mission file: $id.txt"; >> convert_script.ps1
echo     } >> convert_script.ps1
echo     exit 0; >> convert_script.ps1
echo } catch { >> convert_script.ps1
echo     Write-Host "ERROR: $($_.Exception.Message)"; >> convert_script.ps1
echo     exit 1; >> convert_script.ps1
echo } >> convert_script.ps1

:: Run the script with PowerShell
echo Running conversion script...
powershell -ExecutionPolicy Bypass -File convert_script.ps1

:: Check the result
if %errorlevel% NEQ 0 (
    echo.
    echo Error during conversion. Trying alternate method...
    echo.
    
    :: If PowerShell fails, use the fallback method
    goto fallback_method
) else (
    echo.
    echo ===============================================
    echo            CONVERSION COMPLETE
    echo ===============================================
    echo.
    echo Your mission files have been created in data\missions folder.
    echo You can now edit these files and use the TXT to JSON
    echo converter to update your website files.
    echo.
    del convert_script.ps1
    pause
    exit /b 0
)

:fallback_method
echo Using alternate conversion method...
echo This may not preserve all formatting but will get the basics.
echo.

:: Manual extraction method as a fallback
if exist data\missions.json (
    for /f "tokens=*" %%a in ('type data\missions.json ^| findstr "id"') do (
        set line=%%a
        set line=!line:"=!
        set line=!line:,=!
        set line=!line: =!
        for /f "tokens=2 delims=:" %%b in ("!line!") do (
            set missionId=%%b
            echo Processing mission: !missionId!
            
            echo # ARMA 3 MISSION TEMPLATE> "data\missions\!missionId!.txt"
            echo # Edit the fields below and save the file>> "data\missions\!missionId!.txt"
            echo # Use "mission1.txt", "mission2.txt", etc. for filenames>> "data\missions\!missionId!.txt"
            echo.>> "data\missions\!missionId!.txt"
            echo # Basic Mission Information>> "data\missions\!missionId!.txt"
            echo ID:!missionId!>> "data\missions\!missionId!.txt"
            
            :: Get mission details - this is a simplified approach
            for /f "tokens=*" %%c in ('type data\missions.json') do (
                set mline=%%c
                set mline=!mline:"=!
                set mline=!mline:,=!
                
                echo !mline! | findstr /C:"name:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Name:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"location:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Location:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"difficulty:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Difficulty:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"payment:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Payment:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"duration:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Duration:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"teamSize:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo TeamSize:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"lat:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Latitude:%%d>> "data\missions\!missionId!.txt"
                    )
                )
                
                echo !mline! | findstr /C:"lon:" > nul
                if not errorlevel 1 (
                    for /f "tokens=2 delims=:" %%d in ("!mline!") do (
                        echo Longitude:%%d>> "data\missions\!missionId!.txt"
                    )
                )
            )
            
            echo.>> "data\missions\!missionId!.txt"
            echo # Intel Information>> "data\missions\!missionId!.txt"
            
            if exist data\intel.json (
                for /f "tokens=*" %%c in ('type data\intel.json ^| findstr /C:"\"!missionId!\":" /C:"title:" /C:"content:" /C:"images:"') do (
                    set iline=%%c
                    
                    echo !iline! | findstr /C:"title:" > nul
                    if not errorlevel 1 (
                        for /f "tokens=2 delims=:," %%d in ("!iline!") do (
                            set intelTitle=%%d
                            set intelTitle=!intelTitle:"=!
                            echo IntelTitle:!intelTitle!>> "data\missions\!missionId!.txt"
                        )
                    )
                    
                    echo !iline! | findstr /C:"content:" > nul
                    if not errorlevel 1 (
                        for /f "tokens=2* delims=:" %%d in ("!iline!") do (
                            set intelContent=%%e
                            set intelContent=!intelContent:"=!
                            set intelContent=!intelContent:,=!
                            echo IntelContent:!intelContent!>> "data\missions\!missionId!.txt"
                        )
                    )
                    
                    echo !iline! | findstr /C:"images:" > nul
                    if not errorlevel 1 (
                        echo.>> "data\missions\!missionId!.txt"
                        echo # Intel Images (comma-separated list, leave blank if none)>> "data\missions\!missionId!.txt"
                        echo # Example: intel1.jpg,intel2.jpg (files must be in data/images folder)>> "data\missions\!missionId!.txt"
                    )
                )
                
                :: Extract intel images separately
                set "intelImages="
                for /f "tokens=*" %%c in ('type data\intel.json ^| findstr /C:"!missionId!" /C:"goblin.jpg" /C:".jpg" /C:".png" /C:".gif"') do (
                    set iline=%%c
                    echo !iline! | findstr /C:"goblin.jpg" /C:".jpg" /C:".png" /C:".gif" > nul
                    if not errorlevel 1 (
                        for /f "tokens=1* delims=:" %%d in ("!iline!") do (
                            set imgLine=%%e
                            set imgLine=!imgLine:[=!
                            set imgLine=!imgLine:]=!
                            set imgLine=!imgLine:"=!
                            set imgLine=!imgLine: =!
                            set imgLine=!imgLine:,=!
                            if defined imgLine (
                                set "intelImages=!imgLine!"
                            )
                        )
                    )
                )
                echo IntelImages:!intelImages!>> "data\missions\!missionId!.txt"
            ) else (
                echo IntelTitle:!missionId! INTEL>> "data\missions\!missionId!.txt"
                echo IntelContent:>> "data\missions\!missionId!.txt"
                echo.>> "data\missions\!missionId!.txt"
                echo # Intel Images (comma-separated list, leave blank if none)>> "data\missions\!missionId!.txt"
                echo # Example: intel1.jpg,intel2.jpg (files must be in data/images folder)>> "data\missions\!missionId!.txt"
                echo IntelImages:>> "data\missions\!missionId!.txt"
            )
        )
    )
)

echo.
echo ===============================================
echo            CONVERSION COMPLETE
echo ===============================================
echo.
echo Your mission files have been created in data\missions folder.
echo This used the simplified conversion method which may not
echo preserve all formatting. Please check the files.
echo.
pause
exit /b 0
