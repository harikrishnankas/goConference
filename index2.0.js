function setCurrentTimeonLoad(){
    const currentTime = new Date()
    const currentTimeplus30m = new Date(currentTime.getTime() + (30*60000))
    const date = document.getElementById("date")
    const startTime = document.getElementById("startTime")
    const endTime = document.getElementById("endTime")
    date.value = currentTime.getFullYear() + "-" + formatDatePlus1(currentTime.getMonth()) + "-" + formatDate(currentTime.getDate())
    startTime.value = formatDate(currentTime.getHours()) + ":" + formatDate(currentTime.getMinutes())
    endTime.value = formatDate(currentTimeplus30m.getHours()) + ":" + formatDate(currentTimeplus30m.getMinutes())
}

function formatDate(input){
    if(input.toString().length != 2) {
        return "0" + input
    }
    return input
}

function formatDatePlus1(input){
    if(input.toString().length != 2) {
        return "0" + (input + 1)
    }
    return input
}

function formatCalendarDate(date){
    return date.toString().slice(4,10)
}

function createCalendar(){
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const dateHTML = document.getElementById("date")
    const date = new Date(dateHTML.value)
    const selectedWeekSunDate = formatDate(date.getDate() - date.getDay())
    const selectedWeekSun = new Date(`${date.getFullYear()}-${formatDatePlus1(date.getMonth())}-${selectedWeekSunDate}`)
    console.log(selectedWeekSun)
    const timeLabels = document.getElementById('timeLabels');
    const hours = [
        '08:00', '08:30', '09:00', '09:30', '10:00',
        '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00',
        '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    hours.forEach(hour => {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = hour;
        timeLabels.appendChild(label);
        });
    const calendar = document.getElementById("calendar")
    for (let i = 0; i < 7; i++) {
        const dayColumn = document.createElement("div");
        dayColumn.className = `column-${i}`
        const dayHeader = document.createElement("div")
        dayHeader.className = "day-header"
        const rowDate = new Date(selectedWeekSun.getTime() + (i*24*60*60*60 86400000))
        console.log(rowDate + i)
        dayHeader.innerText = `${daysOfWeek[i]} \n ${formatCalendarDate(rowDate)}`
        dayColumn.appendChild(dayHeader)

        const dayBody = document.createElement("div")
        dayBody.className = "day-body"
        dayColumn.appendChild(dayBody)
        calendar.appendChild(dayColumn)
        hours.forEach(hour => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.dataset.time = hour;
            slot.dataset.day = i;

            slot.addEventListener('click', () => {
            slot.classList.toggle('highlight');
            });

            dayBody.appendChild(slot);
        });
    }
}


function load(){
    setCurrentTimeonLoad();
    createCalendar();
}