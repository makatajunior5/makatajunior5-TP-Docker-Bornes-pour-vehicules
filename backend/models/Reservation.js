const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationSchema); 