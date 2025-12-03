// --- 0. IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session'); // <-- 1. IMPORT SESSION

// --- 1. INITIALIZE EXPRESS APP ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- 2. MIDDLEWARE ---
// Set up CORS to allow credentials (cookies) from your frontend
app.use(cors({
    origin: 'http://127.0.0.1:5500', // <-- IMPORTANT: Use the origin of your HTML files (e.g., VS Code Live Server)
    credentials: true 
}));
app.use(express.json()); // Parse incoming JSON bodies

// --- 2.5. SESSION MIDDLEWARE ---
// This MUST come before your routes
app.use(session({
    secret: 'your-very-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if you use HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// --- 3. DEFINE USER MODEL ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- 3.5. AUTH MIDDLEWARE ("THE BOUNCER") ---
// This function checks if the user is logged in
const checkAuth = (req, res, next) => {
    if (req.session.userId) {
        // User is logged in, proceed to the route
        next();
    } else {
        // User is not logged in, send a 401 Unauthorized error
        res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }
};

// --- 4. API ROUTES (ENDPOINTS) ---

// POST /register
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      password: hashedPassword
    });
    const savedUser = await newUser.save();

    // --- NEW ---
    // Log the user in immediately after registering
    req.session.userId = savedUser._id; 
    req.session.username = savedUser.username;

    res.status(201).json({ 
        message: 'User registered successfully',
        username: savedUser.username
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // === THIS IS THE CRITICAL PART ===
    // Set the session so the server remembers the user
    req.session.userId = user._id;
    req.session.username = user.username;

    res.status(200).json({ 
      message: 'Login successful',
      username: user.username 
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- NEW LOGOUT ROUTE ---
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
});

// --- NEW CHECK-AUTH ROUTE ---
// This is the route your protected pages will call.
// We apply the 'checkAuth' middleware to it.
app.get('/check-auth', checkAuth, (req, res) => {
    // If checkAuth passes, the user is logged in.
    // Send back their username.
    res.status(200).json({ 
        message: 'User is authenticated',
        username: req.session.username
    });
});


// --- 5. START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('...Attempting to connect to MongoDB...');
});

// --- 6. CONNECT TO MONGODB ---
// (Your MongoDB connection code is perfect, no changes needed)
const MONGO_URI = 'mongodb://localhost:27017/gym-app';
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('>>> Successfully connected to MongoDB <<<');
})
.catch(err => {
  console.error('\n!!! FAILED TO CONNECT TO MONGODB !!!');
  console.error('Error Details:', err.message);
});