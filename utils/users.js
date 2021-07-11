const users = [];

//join user to the chat
function userJoin(id, username, roomId) {
    const user = { id, username, roomId };
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get room users
function getRoomUsers(roomId) {
    return users.filter(user => user.roomId === roomId);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};