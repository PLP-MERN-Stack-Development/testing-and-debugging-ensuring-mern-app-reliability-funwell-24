export class User {
  constructor(id, username, room = 'general') {
    this.id = id;
    this.username = username;
    this.room = room;
    this.isOnline = true;
    this.lastSeen = new Date();
    this.typing = false;
    this.joinedAt = new Date();
  }

  updateLastSeen() {
    this.lastSeen = new Date();
  }

  setTyping(isTyping) {
    this.typing = isTyping;
  }

  changeRoom(room) {
    this.room = room;
    this.updateLastSeen();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      room: this.room,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen,
      typing: this.typing,
      joinedAt: this.joinedAt
    };
  }
}