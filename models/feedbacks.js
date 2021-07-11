const mongoose = require('mongoose');

var conn = require('../db/conn');

const feedbackschema = new mongoose.Schema({
    review: {
        type: String
    }
})

const Feedback = conn.feedbacks_team_clone.model('Feedback', feedbackschema);
module.exports = Feedback;