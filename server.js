//using express and setting up server
const express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { userJoinvid, getCurrentUservid, userLeavevid, getRoomUsersvid } = require('./utils/users_video');

const app = express();
require('./db/conn');
const Feedback = require('./models/feedbacks');
const Chat = require('./models/chats');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const server = require('http').Server(app);
//setting socket.io
const io = require('socket.io')(server);
//import peer
const { ExpressPeerServer } = require('peer');
//express peer server usage
const peerServer = ExpressPeerServer(server, {
    debug: true
});
//to get unique ids
const { v4: uuidv4 } = require('uuid');

app.use('/peerjs', peerServer);

//setting view engine to ejs
app.set('view engine', 'ejs');

//so that we could use stylesheet and everything
app.use(express.static('public'));

//rendering entry page
app.get('/', function(req, res) {
    res.render('entry', {
        status: 200
    });
})

//invalid room code redirection
app.get('/invalid_roomcode', function(req, res) {
    res.render('entry', {
        status: 400
    });
})

//entering the chat room
app.post('/chat', urlencodedParser, function(req, res) {
    if (validator.isUUID(req.body.roomCode) == true) {
        //checking if the room exists in chat database
        Chat.findOne({ roomId: req.body.roomCode }, async function(err, existing) {
            if (existing == null) {
                const room_to_be_made = new Chat({
                    roomId: req.body.roomCode
                })
                const room_made = await room_to_be_made.save();
            }
        })

        res.render('chat', {
            roomId: req.body.roomCode,
            username: req.body.userName
        });
    } else {
        res.redirect('/invalid_roomcode');
    }
})

//making new chat room
app.post('/new_chat', urlencodedParser, async function(req, res) {
    try {
        const newRoom = uuidv4();
        const room_to_be_made = new Chat({
            roomId: newRoom
        })
        const room_made = await room_to_be_made.save();

        res.render('chat', {
            roomId: newRoom,
            username: req.body.userName
        });
    } catch (error) {
        res.status(400).send(error);
    }
})

//for entering video-meeting
app.post('/video-call', urlencodedParser, function(req, res) {
    if (validator.isUUID(req.body.roomCode) == true) {
        res.render('room', {
            roomId: req.body.roomCode,
            username: req.body.userName
        });
    } else {
        res.status(400).redirect('/');
    }
})

//submit feedback post request
app.post('/submit_feedback', urlencodedParser, async function(req, res) {
    try {
        if ((req.body.user_review) !== "") {
            const feedback_to_be_saved = new Feedback({
                review: req.body.user_review
            })

            //saving feedback to database
            const feedback_saved = await feedback_to_be_saved.save();
        }
        res.render('thanks_after_review');
    } catch (error) {
        res.status(400).send(error);
    }
})



//new meeting room page
app.get('/entry_new_room', function(req, res) {
    res.render('entry_new_room');
})

//exit page
app.get('/exit', function(req, res) {
    res.render('exit');
})

//review page
app.get('/review', function(req, res) {
    res.render('review');
})

//review submission thanks page
app.get('/thanks_after_review', function(req, res) {
    res.render('thanks_after_review');
})



const botName = 'Teams BOT';

//creating conn on Server
io.on('connection', socket => {
    // join chat room
    socket.on('join-chat-room', async({ roomId, username }) => {
        const user = userJoin(socket.id, username, roomId);
        socket.join(user.roomId);

        //loading previous chats
        Chat.find({ roomId: user.roomId }, function(err, chat) {
            if (err) {
                console.log(err);
            } else {
                for (var i = 0; i < chat[0].msgs.length; i++) {
                    socket.emit('message', chat[0].msgs[i]);
                }
            }
        });

        //save joining to database
        const message_to_be_saved = formatMessage(botName, `${user.username} has joined the chat`);
        const message_saved = await Chat.findOneAndUpdate({
            roomId: user.roomId
        }, {
            $push: {
                msgs: message_to_be_saved,
            },
        })

        //broadcast when user connects
        io.to(user.roomId).emit('message', message_to_be_saved);

        //send users and room info
        io.to(user.roomId).emit('roomUsers', {
            roomId: user.roomId,
            users: getRoomUsers(user.roomId)
        });


        //message transport
        socket.on('chatMessage', async msg => {
            const user = getCurrentUser(socket.id);

            //save the message to database
            const message_to_be_saved = formatMessage(user.username, msg);
            const message_saved = await Chat.findOneAndUpdate({
                roomId: user.roomId
            }, {
                $push: {
                    msgs: message_to_be_saved,
                },
            })

            io.to(user.roomId).emit('message', message_to_be_saved);
        })


        //disconnecting
        socket.on('disconnect', async() => {
            const user = userLeave(socket.id);
            if (user) {
                //save exiting to database
                const message_to_be_saved = formatMessage(botName, `${user.username} has left the chat`);
                const message_saved = await Chat.findOneAndUpdate({
                    roomId: user.roomId
                }, {
                    $push: {
                        msgs: message_to_be_saved,
                    },
                })

                socket.to(user.roomId).emit('message', message_to_be_saved);

                //send users and room info
                io.to(user.roomId).emit('roomUsers', {
                    roomId: user.roomId,
                    users: getRoomUsers(user.roomId)
                });
            }
        })
    });



    // join meeting room
    socket.on('join-room', async(roomId, userId, username) => {
        const user = userJoin(socket.id, username, roomId);
        const uservid = userJoinvid(userId, username, roomId);
        socket.join(roomId);

        //loading previous chats
        Chat.find({ roomId: user.roomId }, function(err, chat) {
            if (err) {
                console.log(err);
            } else {
                for (var i = 0; i < chat[0].msgs.length; i++) {
                    socket.emit('message', chat[0].msgs[i]);
                }
            }
        });

        socket.broadcast.to(roomId).emit('user-connected', userId);

        //save joining to database
        const message_to_be_saved = formatMessage(botName, `${user.username} has joined the meeting`);
        const message_saved = await Chat.findOneAndUpdate({
            roomId: user.roomId
        }, {
            $push: {
                msgs: message_to_be_saved,
            },
        })

        //broadcast when user connects
        io.to(user.roomId).emit('message', message_to_be_saved);

        //send users and room info
        io.to(user.roomId).emit('roomUsersVid', {
            users: getRoomUsersvid(user.roomId)
        });

        //send users and room info to chat rooms
        io.to(user.roomId).emit('roomUsers', {
            roomId: user.roomId,
            users: getRoomUsers(user.roomId)
        });


        //message reciever
        socket.on('chatMessage', async msg => {
            const user = getCurrentUser(socket.id);

            //save the message to database
            const message_to_be_saved = formatMessage(user.username, msg);
            const message_saved = await Chat.findOneAndUpdate({
                roomId: user.roomId
            }, {
                $push: {
                    msgs: message_to_be_saved,
                },
            })

            io.to(user.roomId).emit('message', message_to_be_saved);
        })


        //disconnecting
        socket.on('disconnect', async() => {
            const user = userLeave(socket.id);
            if (user) {
                //save exiting to database
                const message_to_be_saved = formatMessage(botName, `${user.username} has left the meeting`);
                const message_saved = await Chat.findOneAndUpdate({
                    roomId: user.roomId
                }, {
                    $push: {
                        msgs: message_to_be_saved,
                    },
                })

                socket.to(user.roomId).emit('message', message_to_be_saved);

                //send users and room info
                io.to(user.roomId).emit('roomUsers', {
                    roomId: user.roomId,
                    users: getRoomUsers(user.roomId)
                });

                //send users and room info
                io.to(user.roomId).emit('roomUsersVid', {
                    users: getRoomUsersvid(user.roomId)
                });

                socket.broadcast.to(roomId).emit('user-disconnected', userId);
                const userleavevid = userLeavevid(userId);
            }

            //send users and room info
            io.to(user.roomId).emit('roomUsersVid', {
                users: getRoomUsersvid(user.roomId)
            });
        })
    })
})

server.listen(process.env.PORT || 3030);