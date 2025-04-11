const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Create a new reservation
router.post('/', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        const newReservation = await reservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('stationId');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('stationId');
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update reservation status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        reservation.status = status;
        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 