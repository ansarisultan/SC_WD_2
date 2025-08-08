document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapContainer = document.getElementById('lapContainer');
    const noLapsMessage = document.querySelector('.no-laps');
    const timeline = document.getElementById('timeline');

    // Variables
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapTimes = [];
    let lastLapTime = 0;

    // Format time to always show 2 digits
    const formatTime = (time) => {
        return time.toString().padStart(2, '0');
    };

    // Format milliseconds to always show 2 digits
    const formatMilliseconds = (time) => {
        return Math.floor(time / 10).toString().padStart(2, '0');
    };

    // Update the display with current time
    const updateDisplay = () => {
        const currentTime = elapsedTime + (isRunning ? Date.now() - startTime : 0);
        
        const hours = Math.floor(currentTime / 3600000);
        const minutes = Math.floor((currentTime % 3600000) / 60000);
        const seconds = Math.floor((currentTime % 60000) / 1000);
        const milliseconds = currentTime % 1000;
        
        hoursDisplay.textContent = formatTime(hours);
        minutesDisplay.textContent = formatTime(minutes);
        secondsDisplay.textContent = formatTime(seconds);
        millisecondsDisplay.textContent = formatMilliseconds(milliseconds);
        
        // Update timeline visualization (resets every minute)
        const timelinePercent = (currentTime % 60000) / 60000 * 100;
        timeline.style.width = `${timelinePercent}%`;
    };

    // Start the stopwatch
    const startStopwatch = () => {
        if (!isRunning) {
            startTime = Date.now();
            timerInterval = setInterval(updateDisplay, 10);
            isRunning = true;
            updateButtonStates();
        }
    };

    // Pause the stopwatch
    const pauseStopwatch = () => {
        if (isRunning) {
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
            isRunning = false;
            updateButtonStates();
        }
    };

    // Reset the stopwatch
    const resetStopwatch = () => {
        clearInterval(timerInterval);
        elapsedTime = 0;
        isRunning = false;
        lapTimes = [];
        lastLapTime = 0;
        updateDisplay();
        updateButtonStates();
        renderLaps();
        timeline.style.width = '0%';
    };

    // Record a lap time
    const recordLap = () => {
        if (isRunning || elapsedTime > 0) {
            const currentTime = elapsedTime + (isRunning ? Date.now() - startTime : 0);
            const lapTime = currentTime - lastLapTime;
            lastLapTime = currentTime;
            
            lapTimes.unshift({
                total: currentTime,
                lap: lapTime
            });
            
            renderLaps();
        }
    };

    // Render lap times
    const renderLaps = () => {
        if (lapTimes.length === 0) {
            noLapsMessage.style.display = 'block';
            return;
        }
        
        noLapsMessage.style.display = 'none';
        
        // Clear existing laps (except header)
        while (lapContainer.children.length > 2) {
            lapContainer.removeChild(lapContainer.lastChild);
        }
        
        // Add new laps
        lapTimes.forEach((lap, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            if (index === 0) lapItem.classList.add('new-lap');
            
            const hoursTotal = Math.floor(lap.total / 3600000);
            const minutesTotal = Math.floor((lap.total % 3600000) / 60000);
            const secondsTotal = Math.floor((lap.total % 60000) / 1000);
            const millisecondsTotal = lap.total % 1000;
            
            const hoursLap = Math.floor(lap.lap / 3600000);
            const minutesLap = Math.floor((lap.lap % 3600000) / 60000);
            const secondsLap = Math.floor((lap.lap % 60000) / 1000);
            const millisecondsLap = lap.lap % 1000;
            
            lapItem.innerHTML = `
                <span>${lapTimes.length - index}</span>
                <span>${formatTime(hoursTotal)}:${formatTime(minutesTotal)}:${formatTime(secondsTotal)}.${formatMilliseconds(millisecondsTotal)}</span>
                <span>${formatTime(hoursLap)}:${formatTime(minutesLap)}:${formatTime(secondsLap)}.${formatMilliseconds(millisecondsLap)}</span>
            `;
            
            lapContainer.appendChild(lapItem);
        });
    };

    // Update button states
    const updateButtonStates = () => {
        startBtn.disabled = isRunning;
        pauseBtn.disabled = !isRunning;
        lapBtn.disabled = !isRunning && elapsedTime === 0;
    };

    // Event Listeners
    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isRunning) {
                pauseStopwatch();
            } else {
                startStopwatch();
            }
        } else if (e.code === 'KeyL') {
            recordLap();
        } else if (e.code === 'KeyR') {
            resetStopwatch();
        }
    });

    // Initialize
    updateButtonStates();
});