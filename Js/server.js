require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' })); 
// --- MONGODB CONNECTION ---require('dotenv').config(); // This loads the .env file

// Use the variable from the .env file
const dbURI = process.env.MONGO_URI; 
const jwtSecret = process.env.JWT_SECRET;

// Debugging check (Optional: Delete this line before deploying)
if (!dbURI) {
    console.error("FATAL ERROR: MONGO_URI is missing in .env file");
    process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => console.log(">>> Connected to MongoDB"))
  .catch(err => console.error("!!! Connection Error:", err));

mongoose.connect(dbURI)
  .then(() => console.log(">>> Connected to MongoDB"))
  .catch(err => console.error("!!! Connection Error:", err));
mongoose.connect(dbURI)
  .then(() => console.log(">>> Connected to MongoDB"))
  .catch(err => console.error("!!! MongoDB Connection Error:", err));
// --- USER MODEL ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // We use EMAIL, not username
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// --- ROUTES ---

// 1. REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body; // Expecting 'email'
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User Registered! Please Login." });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

// 2. LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate Token (ID Card)
        const token = jwt.sign({ id: user._id }, "secretKey123", { expiresIn: "1h" });

        res.json({ 
            message: "Login Successful!", 
            token: token, 
            email: user.email 
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

const PORT = process.env.PORT || 3001; // <--- This is the magic fix
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));