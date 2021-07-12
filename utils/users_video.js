const users = [];

//join user to the meet
function userJoinvid(id, username, roomId) {
    const user = { id, username, roomId };
    users.push(user);
    return user;
}

//get current user
function getCurrentUservid(id) {
    return users.find(user => user.id === id);
}

//user leaves meet
function userLeavevid(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get meet room users
function getRoomUsersvid(roomId) {
    return users.filter(user => user.roomId === roomId);
}

module.exports = {
    userJoinvid,
    getCurrentUservid,
    userLeavevid,
    getRoomUsersvid
};