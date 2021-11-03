const { v4 } = require('uuid');
const db = require('./db');
const { CustomError } = require('./CustomError');

class Comment {
  static async getByApplicationId(applicationId) {
    const commentsData = await db.comments.getByApplicationId(applicationId);
    return commentsData.map((commentData) => new Comment(commentData));
  }

  static async create({ content, applicationId }) {
    // no checks of incoming data
    const newCommentData = {
      content,
      applicationId,
      createdAt: new Date().toISOString(),
      id: v4(),
    };
    await db.comments.create(newCommentData);
    return new Comment(newCommentData);
  }

  constructor({ id, content, applicationId, createdAt }) {
    this.id = id;
    this.content = content;
    this.applicationId = applicationId;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      applicationId: this.applicationId,
    };
  }
}

module.exports = Comment;
