const time = new Date();
console.log("time:", time);

// const time2 = Date.now()
// console.log(time2)

// const formatTime2 = (date) => {
//     const options = {
//         hour: "numeric",
//         minute: "numeric",
//         hour12: true,
//     };
//     return date.toLocaleString("en-US", options);
// };

// const frmtime2 = formatTime2(time2)
// console.log(frmtime2)

// const formatTime = (date) => {
//     const timeOptions = {
//         hour: "numeric",
//         minute: "numeric",
//         second: "numeric", // Uncommented to include seconds for a more complete time representation
//         hour12: true,
//     };
//     const dateOptions = {
//         day: "numeric",
//         month: "numeric",
//         year: "numeric",
//     };
    
//     const formattedTime = date.toLocaleString("en-US", timeOptions);
//     const formattedDate = date.toLocaleString("en-US", dateOptions);

//     return {
//         formattedTime,
//         formattedDate
//     };
// };

// const formatted = formatTime(time);
// console.log("Formatted time:", formatted.formattedTime);
// console.log("Formatted date:", formatted.formattedDate);
