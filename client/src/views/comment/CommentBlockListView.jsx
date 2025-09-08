import React, { useEffect } from "react";

import UserListComponent from "@/components/comment/UserListComponent";
import { useDispatch, useSelector } from "react-redux";
import { createBlockUser, deleteBlockUser, loadBlockUsers } from "@/redux/v2/actions";

const CommentBlockListView = ({ }) => {
  const blockUsers = useSelector(state => state.v2.blockUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadBlockUsers());
  }, [loadBlockUsers])

  const handleAppendUser = (alias) => {
    dispatch(createBlockUser(alias));
  }
  const handleDeleteUser = (userId) => {
    dispatch(deleteBlockUser(userId));
  }
  return (
    <UserListComponent
      title="Block User List"
      users={blockUsers}
      onAppend={handleAppendUser}
      onDelete={handleDeleteUser}
    />
  );
}

export default CommentBlockListView