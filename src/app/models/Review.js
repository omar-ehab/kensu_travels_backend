const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    published_at: {
        type: Date,
        required: true
    },
    
});



const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;