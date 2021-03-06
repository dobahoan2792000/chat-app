const users = [];

// join user to chat
function userJoin(id,username,room) {
    const user = { id, username, room }
    users.push(user)
    return user
}
function getCurrentUser(id){
    return users.find(user => user.id == id)
}
function userLeaveChat(id) {
    const index = users.find(user.id == id)
    if (index !== -1) {
        return users.splice(index,1)[0]
    }
    else return users
}
function getRoomUsers(room) {
    return users.filter(user => user.room == room)
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeaveChat,
    getRoomUsers
}