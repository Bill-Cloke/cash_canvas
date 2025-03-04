import express from 'express';
const app = express();
import cors from 'cors';
import db from './db.js';
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'dist', 'index.html')))


app.use('/api', (req, res) => {
    res.send("API is working")
})

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
