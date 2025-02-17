#!/bin/bash

# Your script to run when online
SCRIPT_TO_RUN="bun ~/git/webNovel_notifier/webNovelScraper.ts"  # Change this to your actual script
PID_FILE="/tmp/online_script.pid"

# Function to check internet connection
check_online() {
    wget -q --spider http://google.com
    return $?  # Returns 0 if online, non-zero if offline
}

# Function to start the script
start_script() {
    if [ -f "$PID_FILE" ]; then
        echo "Script is already running."
    else
        echo "You are online! Starting script..."
        nohup $SCRIPT_TO_RUN > /dev/null 2>&1 &  # Run script in the background
        echo $! > "$PID_FILE"  # Save process ID
    fi
}

# Function to stop the script
stop_script() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        echo "You went offline. Stopping script (PID: $PID)..."
        kill "$PID" && rm -f "$PID_FILE"
    else
        echo "No script running."
    fi
}

# Main loop to check every 10 minutes
while true; do
    if check_online; then
        start_script
    else
        stop_script
    fi
    sleep 60  # Wait 10 minutes
done
