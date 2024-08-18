const CommentService = require("../services/comment");
const { sendError, sendResult } = require("../utils/resp");

const handleLoadComments = async (req, res) => {
    try {
        const comments = await CommentService.loadComments();
        sendResult(res, { comments });
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
};

const handleCreateComment = async (req, res) => {
    try {
        const { text } = req.body;
        await CommentService.createComment(text);
        const comments = await CommentService.loadComments();
        sendResult(res, { comments });
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
};

const handleDeleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await CommentService.deleteComment(id);
        const comments = await CommentService.loadComments();
        sendResult(res, { comments });
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
};

const handleClearComments = async (req, res) => {
    try {
        await CommentService.clearComments(text);
        const comments = await CommentService.loadComments();
        sendResult(res, { comments });
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
};

const CommentCtrl = {
    handleCreateComment,
    handleLoadComments,
    handleDeleteComment,
    handleClearComments,
};

module.exports = CommentCtrl