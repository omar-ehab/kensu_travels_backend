const mongoose = require('mongoose');

const OrganiserSchema = new mongoose.Schema({
    internal_place_id: {
        type: mongoose.ObjectId,
        required: true
    },
    phone_numbers: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    
});



const Organiser = mongoose.model('Organiser', OrganiserSchema);

module.exports = Organiser;