#!/bin/bash
# Checks if there are any debug outputs present in the codebase

logs=$(grep -rn "console.log(" | grep -v server | grep -v coverage | grep -v Binary)
if [[ -z "${logs}" ]]; then
    echo " ==================================="
    echo "| Found no debug output statements. |"
    echo "|       We are good to go!          |"
    echo " ==================================="
else
    echo " ===================================="
    echo "| Found debug output statements.     |"
    echo "| Please remove these before merging |"
    echo " ===================================="
    echo $logs
    echo
    echo
fi
exit 0
