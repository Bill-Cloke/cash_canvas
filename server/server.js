import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import bankRoutes from "./routes/bank.js";
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api/auth', authRoutes)
app.use('/api/bank', bankRoutes)

if (process.env.NODE_ENV == 'development') {
    app.get('*', (req, res) => {
        console.log(req.path)
        res.send("unknown route")
    })
} else {
    app.use(express.static(path.join(__dirname, 'dist')))

    app.get('*', (req, res) => {
        console.log(req.path)
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    })
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
