const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    
});



const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;