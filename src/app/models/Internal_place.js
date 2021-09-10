const mongoose = require('mongoose');

const Internal_place_schema = new mongoose.Schema({
    place_id: {
        type: mongoose.ObjectId,
        required: true
    },
    category_id: {
        type: mongoose.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pictures: {
        type: [String],
        required: true
    },
    main_picture: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    total_rate: {
        type: mongoose.Schema.Types.Double,
        required: true
    },
    opening_hours: [{
        day: {type: String}, //mon - sun
        period: {
          start: {type: String},
          end: {type: String}
          }
        }]
    
});



const Internal_Place = mongoose.model('Internal_place', Internal_place_schema);

module.exports = Internal_Place;