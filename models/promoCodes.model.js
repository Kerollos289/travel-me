//promoCodes.model.js
const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },

});

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
