//js for front end will be here

//setting socket.io
const socket = io('/');

//video grid where i have to show the video
const videoGrid = document.getElementById('video-grid');
const speakerVideo = document.getElementById('speaker-video');
const chatForm = document.getElementById('chat-form');
const userList = document.getElementById('users');
// const { username } = Qs.parse(location.search, {
//     ignoreQueryPrefix: true
// });

//element where we can play the video stream in
const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {};
var myId;
var safeCall;

const peer = new Peer(undefined);

let myVideoStream

//accessing video and audio streams
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addSpeakerStream(myVideo, stream);

    peer.on('connection', function(conn) {
        conn.on('data', function(data) {
            console.log(data);
            peers[data] = safeCall;
        });
    });

    //answering the call(peerjs)
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })

        // peers[userId] = call;
        call.on('close', () => {
            video.remove();
        })

        safeCall = call;
        // console.log("ab ki baat")
        // console.log(recentId);
        // peers[recentId] = call;
        // console.log(peers[recentId]);
    })

    //to listen that user connected
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    })

})

//message part
// // input value
// let text = $("input");
// // when press enter send message
// $('html').keydown(function(e) {
//     if (e.which == 13 && text.val().length !== 0) {
//         // console.log(text.val());
//         socket.emit('chatMessage', text.val());
//         text.val('')
//     }
// });

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

socket.on('message', message => {
    console.log('this is from server', message);
    $("ul").append(`
        <li class="message">
            <div class="line1">
                <b>
                    ${message.username}
                </b>
                <span>
                    ${message.time}
                </span>
            </div>
            
            ${message.text}
        </li>`);
    scrollDownToBottom();
})

socket.on('user-disconnected', userId => {
    // console.log(userId);
    if (peers[userId]) peers[userId].close();
})

peer.on('open', id => {
    //joining the room with a specific room id that is saved in room.ejs
    myId = id;
    socket.emit('join-room', ROOM_ID, id, username);
})

socket.on('roomUsersVid', ({ users }) => {
    outputUsers(users);
})

//adding video streams
const connectToNewUser = (userId, stream) => {

    var conn = peer.connect(userId);
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function() {
        // here you have conn.id
        conn.send(myId);
    });

    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call;

}

//adding video stream
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        //putting video in videoGrid
    videoGrid.append(video);
}

const addSpeakerStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        //putting video in videoGrid
    speakerVideo.append(video);
}

const scrollDownToBottom = () => {
    let d = $('.main-chat-window');
    d.scrollTop(d.prop("scrollHeight"));
}

//mute Unmute
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main-mute-button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main-mute-button').innerHTML = html;
}

//stop play video
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main-video-button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
      <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main-video-button').innerHTML = html;
}

//display room code
const showInviteLink = () => {
    // alert(`Copy and share the below room link to invite:
    // ${ROOM_ID}`)
    /* Get the text field */
    var copyText = document.getElementById("room-code");

    /* Select the text field */
    copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copy and share the following room code to invite : " + copyText.value);
}

//focus on chat
const focusOnChat = () => {
    msg.focus();
}

//maintaining participant list
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
}

//screenShare
const screenshare = () =>{
    navigator.mediaDevices.getDisplayMedia({
        video:{
            cursor:'always'
        },
        audio:{
            echoCancellation:true,
            noiseSupprission:true
        }
    }).then(stream =>{
        console.log("sharing started");
        let videoTrack = stream.getVideoTracks()[0];
        console.log(videoTrack);
        videoTrack.onended = function(){
            stopScreenShare();
        }

    //     let enabled = myVideoStream.getVideoTracks()[0].enabled;
    // if (enabled) {
    //     myVideoStream.getVideoTracks()[0].enabled = false;
    //     setPlayVideo()
    // } else {
    //     setStopVideo()
    //     myVideoStream.getVideoTracks()[0].enabled = true;
    // }

        myVideoStream=videoTrack;
        // for (let x=0;x<peers.length;x++){
        //     let sender = peers[x].getSenders().find(function(s){  //replace video track 
        //         return s.track.kind == videoTrack.kind;
        //     })
        
        //     sender.replaceTrack(videoTrack);
        // }
    })    
}
    
function stopScreenShare(){
    let videoTrack = myVideoStream.getVideoTracks()[0];
    for (let x=0;x<users.length;x++){
        let sender = users[x].getSenders().find(function(s){
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack);
    }
}