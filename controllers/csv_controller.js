// Require the necessary modules
const Student = require('../models/student'); // Assuming the student model is defined in the "../models/student" file
const fs = require('fs');

// Define the function to download the CSV file
module.exports.downloadCSV = async function (req, res) {
  try {
    // Find all students from the MongoDB database
    const arrayStudent = await Student.find({});

    // Initialize variables
    let serialNumber = 1;
    let entry = "";
    let fileData = "S.No, Name, Email, Batch, Status, DSA, WebD, React, Interview, Date, Result";

    // Iterate through each student in the array of students
    for (student of arrayStudent) {
      // Create an entry for the CSV file using the student's data
      entry =
        serialNumber +
        "," +
        student.name +
        "," +
        student.email +
        "," +
        student.batch +
        "," +
        student.status +
        "," +
        student.dsa_score +
        "," +
        student.webD_score +
        "," +
        student.react_score;

      // Check if the student has interviews
      if (student.interviews.length > 0) {
        for (interview of student.interviews) {
          // Append interview details to the entry
          entry +=
            "," +
            interview.company +
            "," +
            interview.date.toString() +
            "," +
            interview.result;
        }
      }

      serialNumber++;
      // Append the entry to the fileData with a new line
      fileData += "\n" + entry;
    }

    // Write the fileData to a CSV file named "data.csv" in the "assets" folder
    const file = fs.writeFile(
      "assets/data.csv",
      fileData,
      function (err, data) {
        if (err) {
          console.log(err);
          return res.redirect("back");
        }
        // If the file is successfully written, download the CSV file
        return res.download("assets/data.csv");
      }
    );
  } catch (err) {
    console.log(err);
  }
};
