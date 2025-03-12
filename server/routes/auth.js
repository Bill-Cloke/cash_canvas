import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";


const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
const passwordRegex = /^(?=.*[a-zA-Z]).{8,16}$/;


router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !usernameRegex.test(username)) {
            return res.status(401).json({ error: "Username must be 4-20 characters (letters/numbers only)" });
        }

        if (!password || !passwordRegex.test(password)) {
            return res.status(401).json({ error: "Password must be 8-16 characters and contain at least 1 letter" });
        }

        const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            return res.status(401).json({ error: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.promise().query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

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

export default router;
