// Require the necessary modules
const Student = require('../models/student'); // Assuming the student model is defined in the "../models/student" file
const Interview = require('../models/interview'); // Assuming the interview model is defined in the "../models/interview" file

// Function to render the page to add a new student
module.exports.addStudent = function(req, res){
    // Check if the user is authenticated (has a user_id cookie)
    if(req.cookies.user_id){
        // If authenticated, render the "add_student" view with the title "Add Student"
        return res.render('add_student', {
            title: 'Add Student',
        });
    } else {
        // If not authenticated, you can handle this case based on your application's requirements
        // For example, you may redirect the user to the sign-in page
        // return res.redirect('/users/sign-in');
    }
};

// Function to create a new student
module.exports.createStudent = function (req, res) {
    // Find a student by their email in the database
    Student.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("Cannot find the student");
            return res.redirect("back");
        }

        if (!user) {
            // If the student with the given email doesn't exist, create a new student
            // Also, check if the provided scores (dsa_score, webD_score, react_score) are within valid range (0-100)
            const dsa_score = req.body.dsa_score;
            const webD_score = req.body.webD_score;
            const react_score = req.body.react_score;
            if (
                dsa_score < 0 ||
                dsa_score > 100 ||
                webD_score > 100 ||
                webD_score < 0 ||
                react_score < 0 ||
                react_score > 100
            ) {
                return res.redirect("back");
            }

            Student.create(
                {
                    name: req.body.name,
                    email: req.body.email,
                    batch: req.body.batch,
                    status: req.body.status,
                    dsa_score: req.body.dsa_score,
                    webD_score: req.body.webD_score,
                    react_score: req.body.react_score,
                    // interviews: [
                    //   {
                    //     company: req.body.company,
                    //     date: req.body.date,
                    //     result: req.body.result,
                    //   },
                    // ],
                },
                function (err, user) {
                    if (err) {
                        console.log("student not added", err);
                        return res.redirect("back");
                    }

                    return res.redirect("/users/profile");
                }
            );
        } else {
            console.log("student is already Added");
            return res.redirect("/users/profile");
        }
    });
};


// Function to fetch and render the details of a specific student based on their id
module.exports.studentDetails = function (req, res) {
    console.log(req.params.id);
    Student.findOne({ _id: req.params.id }, function (err, student) {
        if (err) {
            console.log("Student not found", err);
            return "/users/profile";
        }
        // Render the "student_details" view with the title "MY page" and the fetched student details
        return res.render("student_details", {
            title: "MY page",
            student: student,
        });
    });
};


// Function to render the page to edit a student's details based on their id
module.exports.editStudentDetails = function (req, res) {
    console.log(req.params.id);
    Student.findOne({ _id: req.params.id }, function (err, student) {
        if (err) {
            console.log("Student not found", err);
            return res.redirect("/users/profile");
        }
        // Render the "edit_student" view with the title "MY page" and the fetched student details
        return res.render("edit_student", {
            title: "MY page",
            student: student,
        });
    });
};


// Function to update a student's details
module.exports.updateStudent = function (req, res) {
    // Find a student by their email in the database
    Student.findOne({ email: req.body.email }, function (err, student) {
        if (err) {
            console.log("Student not found", err);
            return res.redirect("back");
        }
        if (student) {
            // Update the student's status if the "status" field is defined in the request body and is different from the current status
            if (req.body.status != undefined && req.body.status != student.status) {
                student.updateOne(
                    { email: req.body.email },
                    { status: req.body.status }
                );
                student.save();
                console.log("student status updated");
                // return res.redirect("back");
            }

            // If "company" field is defined in the request body, add a new interview to the student's interviews array
            if (req.body.company != undefined) {
                console.log(req.body.company, req.body.date, req.body.result);

                Student.updateOne(
                    { email: req.body.email },
                    {
                        $push: {
                            interviews: [
                                {
                                    company: req.body.company,
                                    date: req.body.date,
                                    result: req.body.result,
                                },
                            ],
                        },
                    },
                    function (err, update) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                student.save();
                // req.flash("success", "Student Updated Successfully");
            }

            // Find an interview by its company_name in the database
            Interview.findOne(
                { company_name: req.body.company },
                function (err, company) {
                    if (err) {
                        console.log("cannot find company");
                        return res.redirect("back");
                    }
                    if (company) {
                        // If the interview with the given company_name exists, add the student to the interview's students array
                        Interview.updateOne(
                            { company_name: req.body.company },
                            {
                                $push: {
                                    students: [
                                        {
                                            student: student._id,
                                            result: "Interview Pending",
                                        },
                                    ],
                                },
                            },
                            function (err, company) {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                        company.save();
                    } else {
                        // If the interview with the given company_name doesn't exist, create a new interview
                        Interview.create(
                            {
                                company_name: req.body.company,
                                date: req.body.date,
                                students: [
                                    {
                                        student: student._id,
                                        result: "Interview Pending",
                                    },
                                ],
                            },
                            function (err, new_interview) {
                                if (err) {
                                    console.log("no interview create in db", err);
                                }
                            }
                        );
                    }
                }
            );
            // console.log("student status updated");
            return res.redirect("back");
        }else {
            // req.flash("error", "Student not found. Enter correct Email ID of the student");
        }
        console.log("student found");
        return res.redirect("back");
    });
};
