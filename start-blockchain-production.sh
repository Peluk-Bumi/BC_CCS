#!/bin/bash
# Production startup script for blockchain service

set -e

SERVICE_DIR="/path/to/CCS-project/BE_CCS/blockchain-service"
LOG_FILE="$SERVICE_DIR/blockchain-production.log"
PID_FILE="$SERVICE_DIR/blockchain.pid"

cd "$SERVICE_DIR"

echo "🚀 Starting CCS Blockchain Service (Production)"
echo "Time: $(date)"
echo "Directory: $SERVICE_DIR"
echo "Log: $LOG_FILE"

# Check if already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "❌ Service already running with PID $PID"
        exit 1
    else
        echo "⚠️ Removing stale PID file"
        rm -f "$PID_FILE"
    fi
fi

# Start service in background
nohup node server.js >> "$LOG_FILE" 2>&1 &
SERVICE_PID=$!

# Save PID
echo $SERVICE_PID > "$PID_FILE"

echo "✅ Blockchain service started with PID $SERVICE_PID"
echo "📋 Monitor logs: tail -f $LOG_FILE"
echo "🛑 Stop service: kill $SERVICE_PID && rm -f $PID_FILE"

# Wait a moment and check if it's still running
sleep 3
if ps -p $SERVICE_PID > /dev/null 2>&1; then
    echo "✅ Service is running successfully"

    # Test health endpoint
    sleep 2
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "⚠️ Health check failed - service may still be starting"
    fi
else
    echo "❌ Service failed to start - check logs:"
    tail -n 20 "$LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
fi
