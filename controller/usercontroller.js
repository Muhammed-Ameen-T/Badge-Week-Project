// Import necessary modules
const bcrypt = require('bcrypt');
const userSchema = require('../model/userModel');

// Function to check password strength
const isStrongPassword = (password) => {
  const lengthCheck = password.length >= 6; 
  return lengthCheck;
};

// Function to register a new user
const registerUser = async (req, res) => {
  try {
    // Extract user input from the request body
    const { name, email, password, confirmPassword } = req.body;

    // Check if user already exists
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.render('user/register', { message: "User already exists" });
    }

    // Validate passwords match and are strong enough
    if (password !== confirmPassword) {
      return res.render('user/register', { message: "Passwords do not match" });
    }

    // Send Error if Password length Lessthan 6 charecters
    if (!isStrongPassword(password)) {
      return res.render('user/register', { message: "Password must be at least 6 characters long"});
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //Create a new user Object
    const newUser = new userSchema({
      name,
      email,
      password:hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Redirect to the login page
    return res.redirect('/user/login');

  } catch (error) {
    // Log the error and render an error message
    console.error("Error registering user:", error);
    res.render('user/register', { message: "An error occurred during registration." });
  }
};

// Function to handle user login
const login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;
    // Find the user by email
    const user = await userSchema.findOne({ email });
    // If Not User Exist Pass Error
    if (!user) return res.render('user/login', { message: "User does not exist" });
    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('user/login', { message: 'Incorrect password' });
    // Set the user session
    req.session.user = true;
    // Redirect to the user home page
    res.redirect('/user/home'); 

  } catch (error) {
    // Log the error and render an error message
    console.error("Error logging in user:", error);
    res.render('user/login', { message: "An error occurred during login." });
  }
};

// Function to load the registration page
const loadRegister = (req, res) => {
  res.render('user/register', { message: null });
};

// Function to load the login page
const loadLogin = (req, res) => {
  res.render('user/login', { message: null });
};


// Function to load the login page
const loadHome = (req, res) => {
  res.render('user/usehome');
};

// Function to log User Out
const logout = (req, res) => {
  req.session.user = null;
  res.redirect('/user/login');
};


// MOdule Export Function
module.exports = { registerUser, loadLogin, loadRegister, login, loadHome, logout };
