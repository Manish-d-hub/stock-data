import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [searchTextError, setSearchTextError] = useState("");
  const [selectedDateError, setSelectedDateError] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setSearchTextError("");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchText) setSearchTextError("Stock is required");
    if (!selectedDate) {
      setSelectedDateError("Date is required");
      return;
    }

    // Create a data object to send in the request body
    const date = selectedDate.toISOString().slice(0, 10);
    const bodyObj = {
      stock: searchText.toUpperCase(),
      date,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/fetchStockData",
        bodyObj
      );

      if (data) {
        setApiData(data);
      } else {
        console.error("API Error:", data.statusText);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <h1>Stock Search💹</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Search:
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            className={searchTextError ? "error" : ""}
          />
          {searchTextError && (
            <div className="error-message">{searchTextError}</div>
          )}
        </label>
        <label>
          Select a Date:
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className={selectedDateError ? "error" : ""}
          />
          {selectedDateError && (
            <div className="error-message">{selectedDateError}</div>
          )}
        </label>
        <button type="submit" disabled={!searchText || !selectedDate}>
          Submit
        </button>
      </form>

      {apiData && (
        <div className="stock-data">
          <h2>Stock Data:</h2>
          <ul>
            <li>Open: {apiData.data.open}</li>
            <li>High: {apiData.data.high}</li>
            <li>Low: {apiData.data.low}</li>
            <li>Close: {apiData.data.close}</li>
            <li>Volume: {apiData.data.volume}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
