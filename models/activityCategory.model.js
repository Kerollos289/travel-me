const mongoose = require("mongoose");
const ActivityCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('ActivityCategory', ActivityCategorySchema);

