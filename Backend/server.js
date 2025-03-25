// Install dependencies: npm install express ws mongoose bcrypt jsonwebtoken cors cookie-parser

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const UserModel = require('./models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { OddsScraper } = require('./scraper'); 

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://mranishkmr:Bro90@anish.mmtkc.mongodb.net/anish?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'ssh';
const scraper = new OddsScraper("c19601", "7777");

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB is connected successfully'))
  .catch((error) => console.log('MongoDB connection failed:', error));

  (async () => {
    await scraper.setup();
    await scraper.login("https://adaniexch.in/");
    await scraper.navigateToEvent("https://adaniexch.in/EVENT/4/34151830");
})();

// Signup Route
app.post('/signup', async (req, res) => {
  const { id, password } = req.body;

  if (!(id && password)) {
    return res.status(400).send('All credentials are required.');
  }

  try {
    const existingUser = await UserModel.findOne({ id });

    if (existingUser) {
      return res.status(409).send('ID already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      id,
      password: hashedPassword,
      coin: 0,
    });

    await newUser.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong during signup.');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  if (!(id && password)) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const existingUser = await UserModel.findOne({ id });

    if (!existingUser) {
      return res.status(401).send('Wrong credentials.');
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).send('Wrong credentials.');
    }

    const token = jwt.sign({ user: { id: existingUser.id } }, JWT_SECRET, {
      expiresIn: '1d',
    });
    console.log(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: existingUser.id,
        coin: existingUser.coin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong during login.');
  }
});

// Serve static files from the React build directory
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send("<h1>Ok Ok</h1>")
});

wss.on('connection', async(ws) => {
  console.log('Client connected');

  console.log(await scraper.getOddsAndRates());
  await scraper.monitorOdds(ws);

  const userName = 'Shubham Mishra';
  let no = 1;

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`Hello, ${userName} : ${no++}`);
    }
    if (no > 10) { // Adjust the limit if needed
      clearInterval(interval);
      console.log('Messages sent successfully');
    }
  }, 1000 )//Send every second

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval); // Clean up on disconnect
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

