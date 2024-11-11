import React, { useEffect } from "react";

import CommentListComponent from "@/components/comment/CommentListComponent";
import { useDispatch, useSelector } from "react-redux";
import { createComment, deleteComment, loadComments } from "@/redux/dashboard/actions";

const CommentListView = ({ }) => {
  const homeProps = useSelector(state => state.home);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadComments());
  }, [loadComments]);

  const handleReloadData = () => {
    dispatch(loadComments());
  }
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId, handleReloadData));
  }
  const handleAppendComment = (comment) => {
    dispatch(createComment(comment, handleReloadData));
  }
  return (
    <CommentListComponent
      comments={homeProps.comments}
      onDelete={handleDeleteComment}
      onAdd={handleAppendComment}
    />
  );
}

export default CommentListView