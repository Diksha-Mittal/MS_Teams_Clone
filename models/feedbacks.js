const mongoose = require('mongoose');

var conn = require('../db/conn');

//feedback schema
const feedbackschema = new mongoose.Schema({
    review: {
        type: String
    }
}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
    }
})

const Feedback = conn.feedbacks_team_clone.model('Feedback', feedbackschema);
module.exports = Feedback;