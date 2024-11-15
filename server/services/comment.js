const CommentModel = require("../models/comment")

const loadComments = (agency) =>
    CommentModel.find(agency ? { agency } : {}).sort("-createdAt");

const createComment = (agency, text) =>
    CommentModel.create({ agency, text });

const deleteComment = (id) =>
    CommentModel.findByIdAndDelete(id);

const clearComments = () =>
    CommentModel.deleteMany({});

const CommentService = {
    createComment,
    deleteComment,
    clearComments,
    loadComments,
}

module.exports = CommentService;