const CommentService2 = require("../../services/v2/comment");
const { sendResult, sendError } = require("../../utils/resp");

const handleLoadCommentsForAgency = async (req, res) => {
  try {
    const comments = await CommentService2.loadAgencyComments(req.manager._id);
    sendResult(res, { comments });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};


// const handleLoadAgencyComments = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const comments = await CommentService.loadComments(id);
//     sendResult(res, { comments });
//   } catch (error) {
//     console.error(error);
//     sendError(res, error);
//   }
// };

const handleAppendCommentForAgency = async (req, res) => {
  try {
    const { comments: newComments } = req.body;
    await CommentService2.appendComments(req.manager._id, newComments || []);
    const comments = await CommentService2.loadAgencyComments(req.manager._id);
    sendResult(res, { comments });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleDeleteCommentForAgency = async (req, res) => {
  try {
    const { commentId } = req.params;
    await CommentService2.deleteComment(commentId);
    const comments = await CommentService2.loadAgencyComments(req.manager._id);
    sendResult(res, { comments });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const handleClearCommentsForAgency = async (req, res) => {
  try {
    await CommentService2.clearAgencyComments(req.manager._id)
    const comments = await CommentService2.loadAgencyComments(req.manager._id);
    sendResult(res, { comments });
  } catch (error) {
    console.error(error);
    sendError(res, error);
  }
};

const CommentCtrl2 = {
  handleLoadCommentsForAgency,
  handleAppendCommentForAgency,
  handleClearCommentsForAgency,
  handleDeleteCommentForAgency,
}

module.exports = CommentCtrl2;