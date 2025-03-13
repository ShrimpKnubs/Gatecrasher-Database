@echo off
setlocal enabledelayedexpansion
color 0a
title ARMA 3 Mission Converter

echo ===============================================
echo       ARMA 3 MISSION TO JSON CONVERTER
echo ===============================================
echo.
echo This script converts mission text files to JSON.
echo.
echo It will:
echo  1. Scan data\missions for text files
echo  2. Generate missions.json and intel.json
echo  3. Place them in the data folder
echo.
echo Make sure you have:
echo  - Mission text files in data\missions folder
echo  - Images in data\images folder (if referenced)
echo.
pause

:: Check for necessary folders
if not exist data mkdir data
if not exist data\missions (
    echo ERROR: data\missions folder not found!
    echo Please create this folder and add mission files.
    pause
    exit /b 1
)
if not exist data\images mkdir data\images

echo.
echo Scanning mission files...
echo.

:: Count mission files
set "missionCount=0"
for %%F in (data\missions\*.txt) do set /a missionCount+=1

if %missionCount% EQU 0 (
    echo No mission files found in data\missions folder!
    echo Please add .txt files following the template format.
    pause
    exit /b 1
)

echo Found %missionCount% mission files.
echo.
echo Converting to JSON format...

:: Initialize the missions.json file
echo [> data\missions.json

:: Initialize the intel.json file
echo {> data\intel.json

:: Process each mission file
set "count=0"
for %%F in (data\missions\*.txt) do (
    set /a count+=1
    echo   Processing: %%~nxF
    
    :: Initialize variables
    set "id="
    set "name="
    set "location="
    set "difficulty="
    set "payment="
    set "duration="
    set "teamSize="
    set "lat="
    set "lon="
    set "missionImage="
    set "intelTitle="
    set "intelContent="
    set "intelImages="
    
    :: Read mission file and extract values
    for /f "usebackq tokens=1,* delims=:" %%a in ("%%F") do (
        set "key=%%a"
        set "value=%%b"
        
        if "!key!"=="ID" set "id=!value!"
        if "!key!"=="Name" set "name=!value!"
        if "!key!"=="Location" set "location=!value!"
        if "!key!"=="Difficulty" set "difficulty=!value!"
        if "!key!"=="Payment" set "payment=!value!"
        if "!key!"=="Duration" set "duration=!value!"
        if "!key!"=="TeamSize" set "teamSize=!value!"
        if "!key!"=="Latitude" set "lat=!value!"
        if "!key!"=="Longitude" set "lon=!value!"
        if "!key!"=="MissionImage" set "missionImage=!value!"
        if "!key!"=="IntelTitle" set "intelTitle=!value!"
        if "!key!"=="IntelContent" set "intelContent=!value!"
        if "!key!"=="IntelImages" set "intelImages=!value!"
    )
    
    :: Validate required fields
    if "!id!"=="" (
        echo ERROR: Mission ID not found in %%~nxF
        echo Make sure each mission file has an ID field.
        pause
        exit /b 1
    )
    
    :: Add mission to missions.json
    echo     {>> data\missions.json
    echo         "id": "!id!",>> data\missions.json
    echo         "name": "!name!",>> data\missions.json
    echo         "location": "!location!",>> data\missions.json
    echo         "difficulty": "!difficulty!",>> data\missions.json
    echo         "payment": "!payment!",>> data\missions.json
    echo         "duration": "!duration!",>> data\missions.json
    echo         "teamSize": "!teamSize!",>> data\missions.json
    echo         "coordinates": {>> data\missions.json
    echo             "lat": !lat!,>> data\missions.json
    echo             "lon": !lon!>> data\missions.json
    echo         }>> data\missions.json
    
    :: Add mission image if specified
    if not "!missionImage!"=="" (
        echo         ,"image": "!missionImage!">> data\missions.json
    )
    
    :: Close the mission entry
    if !count! LSS !missionCount! (
        echo     },>> data\missions.json
    ) else (
        echo     }>> data\missions.json
    )
    
    :: Add intel to intel.json
    echo     "!id!": {>> data\intel.json
    echo         "title": "!intelTitle!",>> data\intel.json
    echo         "content": "!intelContent!">> data\intel.json
    
    :: Add intel images if specified
    if not "!intelImages!"=="" (
        echo         ,"images": [>> data\intel.json
        
        :: Process comma-separated list of images
        set "imgList=!intelImages!"
        set "imgCount=0"
        set "totalImgs=0"
        
        :: Count total images
        for %%i in ("!imgList:,=" "!") do set /a totalImgs+=1
        
        for %%i in ("!imgList:,=" "!") do (
            set /a imgCount+=1
            set "img=%%~i"
            if !imgCount! LSS !totalImgs! (
                echo             "!img!",>> data\intel.json
            ) else (
                echo             "!img!">> data\intel.json
            )
        )
        
        echo         ]>> data\intel.json
    ) else (
        echo         ,"images": []>> data\intel.json
    )
    
    :: Close the intel entry
    if !count! LSS !missionCount! (
        echo     },>> data\intel.json
    ) else (
        echo     }>> data\intel.json
    )
)

:: Close the missions.json file
echo ]>> data\missions.json

:: Close the intel.json file
echo }>> data\intel.json

echo.
echo ===============================================
echo            CONVERSION COMPLETE
echo ===============================================
echo.
echo Successfully converted %missionCount% missions.
echo.
echo Files created:
echo   - data\missions.json
echo   - data\intel.json
echo.
echo These files are now ready for your website.
echo.
pause
exit /b 0
