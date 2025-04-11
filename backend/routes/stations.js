const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// Get all stations
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search stations by name (with autocomplete)
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const stations = await Station.find({
            nom_station: { $regex: query, $options: 'i' }
        }).limit(10);
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get nearby stations
router.get('/nearby', async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 10000 } = req.query;
        const stations = await Station.find({
            coordonneesXY: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Filter stations
router.get('/filter', async (req, res) => {
    try {
        const { power, connectorType, accessibility } = req.query;
        const filter = {};
        
        if (power) filter.puissance_nominale = { $gte: parseInt(power) };
        
        if (connectorType) {
            if (connectorType === 'Type 2') filter.prise_type_2 = true;
            else if (connectorType === 'CCS') filter.prise_type_combo_ccs = true;
            else if (connectorType === 'CHAdeMO') filter.prise_type_chademo = true;
        }
        
        if (accessibility) {
            if (accessibility === 'public') filter.condition_acces = 'Accès libre';
            else if (accessibility === 'private') filter.condition_acces = { $ne: 'Accès libre' };
        }
        
        const stations = await Station.find(filter);
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get station by ID
router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 