import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CommentListComponent from "@/components/comment/CommentListComponent";
import { createComment, deleteComment, loadComments } from "@/redux/v2/actions";

const CommentListView = ({ }) => {
  const comments = useSelector(state => state.v2.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadComments());
  }, [loadComments]);

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  }
  const handleAppendComment = (comment) => {
    dispatch(createComment(comment));
  }
  return (
    <CommentListComponent
      comments={comments}
      onDelete={handleDeleteComment}
      onAdd={handleAppendComment}
    />
  );
}

export default CommentListView