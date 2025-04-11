require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const stationRoutes = require('./routes/stations');
const reservationRoutes = require('./routes/reservations');
const path = require('path');
const fs = require('fs');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stations', stationRoutes);
app.use('/api/reservations', reservationRoutes);

// Import data from JSON file
const importData = async () => {
    try {
        const Station = require('./models/Station');
        const dataPath = path.join(__dirname, 'data', 'stations.json');
        
        // Check if file exists
        if (!fs.existsSync(dataPath)) {
            console.error('Error: stations.json file not found in data directory');
            return;
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Validate data structure
        if (!Array.isArray(data)) {
            console.error('Error: Invalid data format. Expected an array of stations.');
            return;
        }

        // Clear existing data
        await Station.deleteMany({});
        console.log('Existing stations cleared');
        
        // Transform dates from strings to Date objects
        const stations = data.map(station => ({
            ...station,
            date_mise_en_service: new Date(station.date_mise_en_service),
            date_maj: new Date(station.date_maj)
        }));
        
        const result = await Station.insertMany(stations);
        console.log(`${result.length} stations imported successfully`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: stations.json file not found in data directory');
        } else if (error instanceof SyntaxError) {
            console.error('Error: Invalid JSON format in stations.json');
        } else {
            console.error('Error importing data:', error.message);
        }
    }
};

// Import data on server start
importData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 