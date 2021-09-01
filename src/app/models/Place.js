const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    picture: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const placeSchema = new mongoose.Schema({
    pictures: {
        type: [String],
        required: true
    },
    categories: [categorySchema],
    overview: {
        type: String,
        required: true
    },
    main_picture: {
        type: String,
        required: true
    },
    governorate: {
        type: String,
        required: true
    },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;