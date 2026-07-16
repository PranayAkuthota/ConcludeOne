require('dotenv').config({ override: true });
console.log("USING KEY:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 15) + "..." : "NONE");
console.log("OPENROUTER KEY PRESENT:", !!process.env.OPENROUTER_API_KEY);
console.log("GROQ KEY PRESENT:", !!process.env.GROQ_API_KEY);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initChroma } = require('./ai/vector/chromaClient');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Demo Mode Flag
global.isDemoMode = false;

// Connect to Database & Vector Store
connectDB();
initChroma();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Conclude One API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
