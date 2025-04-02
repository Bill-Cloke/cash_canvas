import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";


const usernameRange = /^[a-zA-Z0-9]{4,20}$/;
const passwordRange = /^(?=.*[a-zA-Z]).{8,16}$/;


router.post("/signup", async (req, res) => {
    const { username, password, access_phrase} = req.body;

    try {
        if (!username || !usernameRange.test(username)) {
            return res.status(401).json({ error: "Username must be 4-20 characters (letters/numbers only)" });
        }

        if (!password || !passwordRange.test(password)) {
            return res.status(401).json({ error: "Password must be 8-16 characters and contain at least 1 letter" });
        }

        const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            return res.status(401).json({ error: "Username already taken" });
        }

        if (access_phrase.length < 8 || access_phrase.length > 200) {
            return res.status(401).json({ error: "Access phrase must be between 8 and 200 characters." });
          }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAccessPhrase = await bcrypt.hash(access_phrase, 10);

        await db.promise().query("INSERT INTO users (username, password, access_phrase) VALUES (?, ?, ?)", [username, hashedPassword, hashedAccessPhrase]);

        res.json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Signup error:", error); 
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);
        if (users.length === 0) return res.status(401).json({ error: "Invalid username or password" });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid username or password" });

        // Generates JWT
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        // Stores JWT in cookie
        res.cookie("authToken", token, { httpOnly: true, secure: false, maxAge: 3600000 }); // 1 hour
        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Logout (Clears JWT)
router.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
});

// Check if User is Logged In (JWT Validation)
router.get("/session", (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.json({ loggedIn: false });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.json({ loggedIn: true, user: verified });
    } catch (error) {
        res.json({ loggedIn: false });
    }
});

router.post('/reset-password', async (req, res) => {
    const { username, access_phrase, newPassword } = req.body;
  
    if (!username || !access_phrase || !newPassword) {
      return res.status(401).json({ error: 'All fields are required.' });
    }
  
    try {
        const [rows] = await db.promise().query('SELECT access_phrase FROM users WHERE username = ?', [username]);

        const isMatch = await bcrypt.compare(access_phrase, rows[0].access_phrase);
        
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid access phrase.' });
        }

      if (!newPassword || !passwordRange.test(newPassword)) {
        return res.status(401).json({ error: "Password must be 8-16 characters and contain at least 1 letter" });
    }
  
      const userId = rows[0].user_id;
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await db.promise().query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

      res.json({ message: 'Password successfully reset.' });
    } catch (err) {
      console.error('Error resetting password:', err);
      res.status(500).json({ error: 'Server error during password reset.' });
    }
  });  



export default router;
