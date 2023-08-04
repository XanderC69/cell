// Require the necessary module
const Interview = require('../models/interview'); // Assuming the interview model is defined in the "../models/interview" file

// Function to render the page to add an interview
module.exports.addInterview = function (req, res) {
  // Check if the user is authenticated (has a user_id cookie)
  if (req.cookies.user_id) {
    // If authenticated, render the "add_interview" view with the title "Add Student"
    return res.render("add_interview", {
      title: "Add Student",
    });
  } else {
    // If not authenticated, redirect the user to the sign-in page
    return res.redirect("/users/sign-in");
  }
};

// Function to create a new interview
module.exports.createInterview = function (req, res) {
  console.log(req.body.company_name);
  // Find an interview by its company_name in the database
  Interview.findOne({ company_name: req.body.company_name }, function (err, company) {
    if (err) {
      console.log("error in finding the company", err);
      return res.redirect("back");
    }

    if (!company) {
      // If the interview with the given company_name doesn't exist, create a new interview
      Interview.create(
        {
          company_name: req.body.company_name,
          date: req.body.interview_date,
          // students: [
          //   {
          //     student: req.body.student,
          //     result: req.body.result,
          //   },
          // ],
        },
        function (err, new_interview) {
          if (err) {
            console.log("cant create interview", err);
            return res.redirect("back");
          }
          //   req.flash("success", "Interview Added Successfully");
          return res.redirect("/users/profile");
        }
      );
    } else {
      console.log("interview is already added");
      //   req.flash("success", "Interview is already added");
      return res.redirect("back");
    }
  });
};

// Function to fetch interview details based on the interview id
module.exports.interviewDetails = async (req, res) => {
  try {
    // Find the interview by its id and populate the "students" field with student details (only "name" field is included)
    const interviews = await Interview.findOne({ _id: req.params.id }).populate("students.student", "name");

    // Render the "interview_details" view with the title "MY page" and the fetched interview details
    return res.render("interview_details", {
      title: "MY page",
      interview: interviews,
    });
  } catch (err) {
    console.log("error while fetching all the interviews from the DB!", err);
    // Return an error response if there's an error fetching the interview details
    return res.status(500).json({
      message: "error while fetching all the interviews from the DB!",
    });
  }
};
