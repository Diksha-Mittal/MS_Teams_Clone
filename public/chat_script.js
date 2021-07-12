const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

//join chatroom
socket.emit('join-chat-room', { roomId, username });

//get room and users
socket.on('roomUsers', ({ roomId, users }) => {
    outputRoomId(roomId);
    outputUsers(users);
})

//output message when recieved
socket.on('message', message => {
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//send message
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

const botName = 'Teams BOT';

//function to output message
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    //to handle bot messages differently
    if (message.username === botName) {
        div.classList.add('botGen');
    }

    div.innerHTML = `
        <p class="meta">
            ${message.username}
            <span>
                ${message.time}
            </span>
        </p>
        <p class="text">
            ${message.text}
        </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//function to output room Id in left pane
function outputRoomId(roomId) {
    roomName.innerText = roomId;
}

//function to output users in left pane
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
}