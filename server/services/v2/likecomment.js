const LikeCommentModel = require("../../models/likecomment");

const loadComments = (search) => {
  const searchQuery = search ? { text: { $regex: search, $options: "i" } } : {}
  const query = {
    ...searchQuery,
  }
  return LikeCommentModel.find(query)
}

const addComments = (comments) =>
  LikeCommentModel.bulkWrite(comments.map(comment => ({
    insertOne: {
      document: {
        text: comment,
      }
    }
  })));

const deleteComment = (commentId) =>
  LikeCommentModel.findByIdAndDelete(commentId)

const deleteComments = (commendIds) =>
  LikeCommentModel.deleteMany({ _id: { $in: commendIds } });

const pickupComments = (size) =>
  LikeCommentModel.aggregate([{ $sample: { size } }]);

const LikeCommentService = {
  loadComments,
  addComments,
  deleteComment,
  deleteComments,
  pickupComments
};

module.exports = LikeCommentService;