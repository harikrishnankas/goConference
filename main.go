package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

type BookingDetail struct {
	Name      string    `json:"name"`
	Room      string    `json:"room"`
	Date      string    `json:"date"`
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
}

func main() {

	//map to store booingdetails
	bookingDetailsMap := make(map[string]map[string][]BookingDetail)
	tmpl := template.Must(template.ParseFiles("index.html"))
	tmplhistory := template.Must(template.ParseFiles("history.html"))

	// Serve the HTML file
	http.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		tmpl.Execute(res, nil)
	})

	http.HandleFunc("/form", func(res http.ResponseWriter, req *http.Request) {
		http.ServeFile(res, req, "form.html")
	})

	http.HandleFunc("/js", func(res http.ResponseWriter, req *http.Request) {
		http.ServeFile(res, req, "index.js")
	})

	http.HandleFunc("/history", func(res http.ResponseWriter, req *http.Request) {
		readJSON(bookingDetailsMap)
		historyMapByDate := make(map[string]map[string]map[string][]BookingDetail)
		for room, dateMap := range bookingDetailsMap {
			for date, bookingDetailsArray := range dateMap {
				for i := range bookingDetailsArray {
					bookingDetail := bookingDetailsArray[i]
					fmt.Println(bookingDetail)
					historyDateMap, existHistoryRoom := historyMapByDate[room]
					if existHistoryRoom {
						historyUserMap, existHistoryDate := historyDateMap[date]
						if existHistoryDate {
							historyBookingDetailsArray, existHistoryUser := historyUserMap[bookingDetail.Name]
							if existHistoryUser {
								historyBookingDetailsArray = append(historyBookingDetailsArray, bookingDetail)
								historyUserMap[bookingDetail.Name] = historyBookingDetailsArray
							} else {
								historyUserMap[bookingDetail.Name] = []BookingDetail{bookingDetail}
							}

						} else {
							historyDateMap[date] = map[string][]BookingDetail{bookingDetail.Name: {bookingDetail}}
						}

					} else {
						historyMapByDate[room] = map[string]map[string][]BookingDetail{bookingDetail.Date: {bookingDetail.Name: {bookingDetail}}}
					}
				}
			}
		}
		fmt.Println("History map", historyMapByDate)
		tmplhistory.Execute(res, historyMapByDate)
	})

	// Handle form submission
	http.HandleFunc("/bookslot", func(res http.ResponseWriter, req *http.Request) {
		readJSON(bookingDetailsMap)
		if req.Method == http.MethodPost {
			name := req.FormValue("name")
			room := req.FormValue("room")
			date := req.FormValue("date")
			startTime := parseDate(date, req.FormValue("startTime"))
			endTime := parseDate(date, req.FormValue("endTime"))

			data := BookingDetail{Name: name, Room: room, Date: date, StartTime: startTime, EndTime: endTime}

			dateMap, existRoom := bookingDetailsMap[room]
			if existRoom {
				bookingArray, existDate := dateMap[date]
				if existDate {
					if isSlotAvailable(bookingArray, startTime, endTime) {
						bookingArray = append(bookingArray, data)
						dateMap[date] = bookingArray
					} else {
						tmpl.Execute(res, "Already booked")
					}
				} else {
					dateMap[date] = []BookingDetail{data}
				}
			} else {
				dateMap := map[string][]BookingDetail{date: {data}}
				bookingDetailsMap[room] = dateMap
			}

			saveToJSON(bookingDetailsMap)

			// Respond to the client
			// res.Write([]byte("Form submitted successfully!"))
			// http.ServeFile(res, req, "index.html")
			tmpl.Execute(res, "Submmited")
		} else {
			http.Error(res, "Invalid request method", http.StatusMethodNotAllowed)
		}
	})

	// exec.Command("rundll32", "url.dll,FileProtocolHandler", "http://localhost:8080").Start()
	// Start the server
	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func isSlotAvailable(bookingArray []BookingDetail, startTime, endTime time.Time) bool {
	for i := range bookingArray {
		savedData := bookingArray[i]
		fmt.Println("inside loop", savedData)
		if checkTimeIsInBetween(savedData, startTime, endTime) {
			return false
		}
	}
	return true
}

func checkTimeIsInBetween(savedData BookingDetail, startTime, endTime time.Time) bool {
	return startTime.After(savedData.StartTime) && startTime.Before(savedData.EndTime) ||
		endTime.After(savedData.StartTime) && endTime.Before(savedData.EndTime) ||
		savedData.StartTime.After(startTime) && savedData.EndTime.Before(startTime)
}

func parseDate(dateStr string, timeStr string) time.Time {
	timeInput := dateStr + "T" + timeStr + ":00+05:30"
	parsedDate, err := time.Parse(time.RFC3339, timeInput)
	if err != nil {
		fmt.Println("Error:", err)
	}
	fmt.Println(parsedDate)
	return parsedDate
}

// Function to save data to a JSON file
func saveToJSON(data map[string]map[string][]BookingDetail) error {
	fmt.Println("save data : ", data)
	file, err := os.OpenFile("data.json", os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	// Write the data to the JSON file
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ") // Optional: for pretty printing
	return encoder.Encode(data)
}

func readJSON(bookingDetailsMap map[string]map[string][]BookingDetail) {

	file, err := os.Open("data.json")
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
	}
	defer file.Close()

	// Read the file content
	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf("Error reading file: %v", err)
	}

	// Unmarshal the JSON data into the struct
	// var person FormData
	if err := json.Unmarshal(byteValue, &bookingDetailsMap); err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
	}

}

// go run main.go
// go build -o form_handler.exe main.go
