import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Example User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  tickets: Number,
  referralCode: String,
  transactions: Array,
});
const User = mongoose.model('User', userSchema);

// Auth middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes
app.get('/api/games', (req, res) => {
  res.json({ games: ['slots', 'roulette', 'blackjack'] });
});

app.post('/api/account', authenticateToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  res.json(user);
});

app.post('/api/ticket', authenticateToken, async (req, res) => {
  // Example: Add ticket logic
  res.json({ success: true });
});

app.post('/api/payment', authenticateToken, async (req, res) => {
  // Example: Payment logic
  res.json({ success: true });
});

app.post('/api/referral', authenticateToken, async (req, res) => {
  // Example: Referral logic
  res.json({ success: true });
});

app.post('/api/transaction', authenticateToken, async (req, res) => {
  // Example: Transaction logic
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password, tickets: 0, referralCode: '', transactions: [] });
  await user.save();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
