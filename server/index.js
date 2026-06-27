require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initChroma } = require('./ai/vector/chromaClient');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database & Vector Store
connectDB();
initChroma();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Conclude One API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
