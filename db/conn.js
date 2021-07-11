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

//databses collecting feedback
mongoose.feedbacks_team_clone = mongoose.createConnection("mongodb+srv://diksha_mittal:safepassword@cluster0.xn4xy.mongodb.net/teams?retryWrites=true/feedbacks_team_clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

//database collecting chats for every room
mongoose.room_chats = mongoose.createConnection("mongodb+srv://diksha_mittal:safepassword@cluster0.xn4xy.mongodb.net/teams?retryWrites=true/room_chats", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

module.exports = mongoose;