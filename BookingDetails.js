export  default class BookingDetails{
    BookingDetails(){

    }
    getName(){
        return this.name;
    }
    setName(name){
        this.name = name;
    }
    getDate(){
        return this.date;
    }
    setDate(date){
        this.date = date;
    }
    getStartTime(){
        return this.startTime;
    }
    setStartTime(startTime){
        this.startTime = startTime;
    }
    getEndTime(){
        return this.endTime;
    }
    setEndTime(endTime){
        this.endTime = endTime;
    }
    getRoom(){
        return this.getRoom;
    }
    setRoom(room){
        this.room = room;
    }
}

// module.export = BookingDetails;