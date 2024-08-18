const CommentModel = require("../models/comment")

const loadComments = () => 
    CommentModel.find({});

const createComment = (text) => 
    CommentModel.create({text})

const deleteComment = (id) => 
    CommentModel.findByIdAndDelete(id)

const clearComments = () => 
    CommentModel.deleteMany({})

const CommentService = {
    createComment,
    deleteComment,
    clearComments,
    loadComments,
}

module.exports = CommentService;