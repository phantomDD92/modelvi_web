const CommentModel = require("../../models/comment");


const loadAgencyComments = (agencyId) =>
  CommentModel.find({ agency: agencyId }).sort("-createdAt");

const appendComments = (agencyId, comments) =>
  CommentModel.bulkWrite(
    comments.map(comment => ({
      insertOne: {
        document: {
          agency: agencyId,
          text: comment,
        }
      }
    }))
  );

const createComment = (agencyId, text) =>
  CommentModel.create({ agency: agencyId, text });

const deleteComment = (commentId) =>
  CommentModel.findByIdAndDelete(commentId);

const clearAgencyComments = (agencyId) =>
  CommentModel.deleteMany({ agency: agencyId });

const loadComments = ({ agency, search }) => {
  const agencyQuery = agency && agency != "" ? { agency } : {};
  const searchQuery = search && search != ""
    ? { text: { $regex: search, $options: "i" } }
    : {}
  const query = {
    ...agencyQuery,
    ...searchQuery,
  }
  return CommentModel.find(query)
    .sort({ agency: 1 })
    .populate("agency", "name");
}

const CommentService2 = {
  loadComments,
  loadAgencyComments,
  clearAgencyComments,
  appendComments,
  createComment,
  deleteComment,
}

module.exports = CommentService2;