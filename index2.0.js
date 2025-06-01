
function setTimeToHtml(time){
    const timePlus30m = new Date(time.getTime() + (30*60000))
    const date = document.getElementById("date")
    const startTime = document.getElementById("startTime")
    const endTime = document.getElementById("endTime")
    date.value = time.getFullYear() + "-" + formatDatePlus1(time.getMonth()) + "-" + formatDate(time.getDate())
    startTime.value = formatDate(time.getHours()) + ":" + formatDate(time.getMinutes())
    endTime.value = formatDate(timePlus30m.getHours()) + ":" + formatDate(timePlus30m.getMinutes())
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

function changeCalendarHeader(){
    Array.from(document.getElementsByClassName("highlight")).forEach(element => element.classList.toggle("highlight"))
    const changedate = dummy();
    const dayList = document.getElementsByClassName("day")
    Array.from(dayList).forEach((day,i) =>{
        setHeaderForCalendar(changedate,day.children[0],i)

    })
}

function dummy(){
    const dateHTML = document.getElementById("date");
    const date = new Date(dateHTML.value)
    const selectedWeekSunDate = formatDate(date.getDate() - date.getDay())
    return new Date(date.getFullYear(),date.getMonth(),selectedWeekSunDate)
}

function setHeaderForCalendar(date,element,column){
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const rowDate = new Date(date.getTime() + (column*24*60*60*1000))
    element.innerText = `${daysOfWeek[column]} \n ${rowDate.toString().slice(4,10)}`
    element.dataset.date = rowDate
}


function createCalendar(){
    const selectedWeekSun = dummy();
    const timeLabels = document.getElementById('timeLabels');
    const hours = [
        '08:00', '08:30', '09:00', '09:30', '10:00',
        '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00',
        '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    

    const label = document.createElement('div');
        label.className = 'day-header';
        // label.textContent = "timing";
        timeLabels.appendChild(label);

    hours.forEach(hour => {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = hour;
        timeLabels.appendChild(label);
        });
    const calendar = document.getElementById("calendar-dates")
    for (let i = 0; i < 7; i++) {
        const dayColumn = document.createElement("div");
        dayColumn.className = "day"

        const dayHeader = document.createElement("div")
        dayHeader.className = "day-header"
        setHeaderForCalendar(selectedWeekSun,dayHeader,i)
        dayColumn.appendChild(dayHeader)

        const dayBody = document.createElement("div")
        dayBody.className = "day-body"
        hours.forEach(hour => {
            const slot = document.createElement('div');
            slot.className = 'Calendar-time-slot';
            slot.dataset.time = hour;
            slot.dataset.day = i;

            slot.addEventListener('click', () => {
                Array.from(document.getElementsByClassName("highlight")).forEach(element => element.classList.toggle("highlight"))
                time = slot.dataset.time
                date = new Date(slot.parentElement.parentElement.children[0].dataset.date)
                selectedTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),time.slice(0,2),time.slice(3,5))
                setTimeToHtml(selectedTime);
                slot.classList.toggle('highlight');
                selectedTimeInCalendar = slot;
            });

            dayBody.appendChild(slot);
        });
        dayColumn.appendChild(dayBody)

        calendar.appendChild(dayColumn)
    }
}

function updatesize(){
    const formHeight = document.getElementsByClassName("form")[0].getBoundingClientRect().height;
    const calendarTimeSlotHeight = document.getElementsByClassName("Calendar-time-slot")[0].getBoundingClientRect().height;
    document.querySelectorAll(".day-header").forEach(header =>{
        header.style.top = formHeight + "px"
    })
    document.querySelectorAll(".time-label").forEach(timeLabel =>{
        console.log(calendarTimeSlotHeight)
        timeLabel.style.height = calendarTimeSlotHeight + "px"
    })
}

function load(){
    const currentTime = new Date();
    setTimeToHtml(currentTime);
    createCalendar();
    updatesize()
}

window.addEventListener("load", () => {
    const spinnerContainer = document.getElementById("spinner-container");
    const spinner = document.getElementsByClassName("spinner")[0];
    // Hide the spinner
    setTimeout(() => {
        spinnerContainer.style.display = 'none';
        spinnerContainer.remove(); 
  }, 2000);
})

window.addEventListener("resize", updatesize());


