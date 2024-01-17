// Function to fetch the current date and time
export function FetchDateTime(){
    return new Date()
}

// Function to fetch the current date and time in a formatted ISO string
export function FetchDateTimeISO(){
    
    // Formatting date and time components to ensure two digits
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = currentDate.getFullYear();

    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    // Returning formatted date-time string
    return `${day}-${month}-${year} ${hours}:${minutes} `;
}

// Function to fetch the date period in a specific format
export function FetchDatePeriod() {
    const date = FetchDateTime();

    const month = date.getMonth() + 1; // Months are zero-indexed, adding 1 for correct month
    const formattedMonth = month < 10 ? `0${month}` : `${month}`; // Ensuring two digits for the month

    // Returning the formatted date period string
    return `${date.getFullYear()}${formattedMonth}`;
}