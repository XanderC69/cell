// Require the necessary modules
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user"); // Assuming the user model is defined in the "../models/user" file

// Configure authentication using Passport LocalStrategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Set the field to be used for username (in this case, it's "email")
      passReqToCallback: true, // Pass the entire request object to the callback function
    },
    function (req, email, password, done) {
      // Find a user by their email in the database and establish their identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log('Error in finding user -->passport');
          return done(err);
        }

        // If user is not found or the password doesn't match, authentication fails
        if (!user || user.password != password) {
          console.log('Invalid username/password');
          return done(null, false);
        }

        // If the user is found and password matches, authentication is successful
        return done(null, user);
      });
    }
  )
);

// Serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// Middleware to check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in, then pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not signed in, redirect them to the sign-in page
  return res.redirect("/users/sign-in");
};

// Middleware to set the authenticated user to res.locals for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed-in user from the session cookie
    // We are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

// Export the configured Passport object
module.exports = passport;
