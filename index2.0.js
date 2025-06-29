
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
    loadData("/history")
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
        dayColumn.appendChild(dayBody)
        hours.forEach(hour => {
            const slot = document.createElement('div');
            slot.className = 'Calendar-time-slot';
            slot.dataset.time = hour;
            slot.dataset.day = i;
            dayBody.appendChild(slot);
            slot.addEventListener('click', updateCalendarDateStyle); 
        });
        calendar.appendChild(dayColumn)
    }
}

function updateCalendarDateStyle(event) {

    const slot = event.currentTarget;
                Array.from(document.getElementsByClassName("highlight")).forEach(element => element.classList.toggle("highlight"))
                time = slot.dataset.time
                date = new Date(slot.parentElement.parentElement.children[0].dataset.date)
                selectedTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),time.slice(0,2),time.slice(3,5))
                setTimeToHtml(selectedTime);
                slot.classList.toggle('highlight');
                selectedTimeInCalendar = slot;
            }

function updateHeight(){
    // console.log("resize")
    const formHeight = document.getElementsByClassName("form")[0].getBoundingClientRect().height;
    // const calendarTimeSlotHeight = document.getElementsByClassName("Calendar-time-slot")[0].getBoundingClientRect().height;
    document.querySelectorAll(".day-header").forEach(header =>{
        header.style.top = (formHeight) + "px"
    })
    // document.querySelectorAll(".time-label").forEach(timeLabel =>{
    //     console.log(calendarTimeSlotHeight)
    //     timeLabel.style.height = calendarTimeSlotHeight + "px"
    // })
}

function load(){
    const currentTime = new Date();
    setTimeToHtml(currentTime);
    createCalendar();
    updateHeight();
    loadData("/history")
}

window.addEventListener("load", () => {
    const message = document.getElementById("message");
    if(message.innerHTML == "Submmited"){
        document.getElementById("spinner-text").innerHTML = "varataaa 🤣🤣👋👋"
    }
    const spinnerContainer = document.getElementById("spinner-container");
    const spinner = document.getElementsByClassName("spinner")[0];
    // Hide the spinner
    setTimeout(() => {
        spinnerContainer.style.display = 'none';
        spinnerContainer.remove(); 
  }, 2000);
})

window.addEventListener("resize", updateHeight());


async function loadContent(url, selector) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = text;
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    }
  }

async function loadData(url) {
    removePreviousWeekHistoryDetails();
    try {
      const response = await fetch(url);
      const text = await response.text();
      const room = document.getElementById("room").value
      const historyMap = new Map(Object.entries(JSON.parse(text)))
      const roomHistory = objectToMapWithDateAsKey(historyMap.get(room));
      const WeekList = Array.from(document.querySelectorAll(".day-header"));
      console.log(roomHistory)
      WeekList.shift(); //to remove the empty record
      WeekList.forEach(date =>{
        const weekCalenderDate = new Date(date.dataset.date).toISOString()// TODO: remove 5:30
        console.log("date from HTML " +date.dataset.date)
        console.log(weekCalenderDate);
        if(roomHistory.has(weekCalenderDate)){
            const dateHistoryList = roomHistory.get(weekCalenderDate)
            dateHistoryList.forEach(dateHistory => {
                Array.from(date.parentElement.children[1].children).forEach(htmlDate =>{
                    if(htmlDate.dataset.time === dateHistory.startTime.substring(11,16)){
                        htmlDate.innerHTML = "Booked By " + dateHistory.name
                        htmlDate.classList.add('history');
                        htmlDate.classList.add('no-hover');
                        htmlDate.removeEventListener("click", updateCalendarDateStyle) //to remove event listner
                    }
                })
            })

        }
      })
    //   const weekStartDate = new Date(document.querySelectorAll(".day-header")[1].dataset.date);
    //   const weekEndDate = new Date(document.querySelectorAll(".day-header")[7].dataset.date);
    //   for (const dateStr of roomHistory.keys()) {
    //     const date = new Date(dateStr);
    //     if(isDateBefore(date,weekStartDate) && isDateBefore(weekEndDate,date)){
    //         blockbookedSlot(date,roomHistory.get(dateStr));
    //     }
    //   }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
}

function removePreviousWeekHistoryDetails(){
    const historyToBeRemoved = Array.from(document.getElementsByClassName("history"));
    historyToBeRemoved.forEach(historyElement => {
        historyElement.innerHTML = ""
        historyElement.classList.remove("history");
        historyElement.classList.remove("no-hover");
        historyElement.addEventListener("click", updateCalendarDateStyle);
    })
}

function isDateBefore(dateToBeCheked,referenceDate) {
    return referenceDate < dateToBeCheked;
}

function objectToMapWithDateAsKey(inputObj){
    const map = new Map();
    for (const key in inputObj){
        const date = new Date(key);
        date.setUTCHours(-5, -30, 0, 0);
        map.set(date.toISOString() , inputObj[key]);
    }
    return map;
}

function blockbookedSlot(date,bookedList){
    console.log(date)
    console.log(bookedList)
    const WeekList = Array.from(document.querySelectorAll(".day-header"))
}