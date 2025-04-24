package main

import (
	"encoding/json"
    "fmt"
    "net/http"
	"os"
	"os/exec"
)

type FormData struct {
    Name  string `json:"name"`
    Room string `json:"room"`
}

func main() {
    // Serve the HTML file
    http.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
        http.ServeFile(res, req, "index.html")
    })

    // Handle form submission
    http.HandleFunc("/bookslot", func(res http.ResponseWriter, req *http.Request) {
        if req.Method == http.MethodPost {
            name := req.FormValue("name")
            room := req.FormValue("room")
			// date := req.FormValue("date")
			// startTime := req.FormValue("startTime")
			// endTime := req.FormValue("endTime")

            // Print the received data to the console
            fmt.Printf("Name: %s, Email: %s\n", name,)

			data := FormData{Name: name, Room: room}

			saveToJSON(data)

            // Respond to the client
            res.Write([]byte("Form submitted successfully!"))
        } else {
            http.Error(res, "Invalid request method", http.StatusMethodNotAllowed)
        }
    })

	exec.Command("rundll32", "url.dll,FileProtocolHandler", "http://localhost:8080").Start()
    // Start the server
    fmt.Println("Server is running on http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}

// Function to save data to a JSON file
func saveToJSON(data FormData) error {
    file, err := os.OpenFile("data.json", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return err
    }
    defer file.Close()

    // Write the data to the JSON file
    encoder := json.NewEncoder(file)
    encoder.SetIndent("", "  ") // Optional: for pretty printing
    return encoder.Encode(data)
}


// go run main.go
// go build -o form_handler.exe main.go