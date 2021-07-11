const mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/feedbacks_team_clone", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }).then(() => {
//     // console.log("success");
// }).catch((e) => {
//     // console.log("error");
// })

mongoose.feedbacks_team_clone = mongoose.createConnection("mongodb://localhost:27017/feedbacks_team_clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.room_chats = mongoose.createConnection("mongodb://localhost:27017/room_chats", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

module.exports = mongoose;