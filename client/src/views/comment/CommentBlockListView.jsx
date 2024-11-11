import React, { useEffect } from "react";

import UserListComponent from "@/components/comment/UserListComponent";
import { useDispatch, useSelector } from "react-redux";
import { createUser, deleteUser, loadUsers } from "@/redux/dashboard/actions";

const CommentBlockListView = ({ }) => {
  const homeProps = useSelector(state => state.home);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUsers());
  })
  const handleReloadData = () => {
    dispatch(loadUsers());
  }
  const handleAppendUser = (alias) => {
    dispatch(createUser(alias, "block", handleReloadData));
  }
  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId, handleReloadData));
  }
  return (
    <UserListComponent
      title="Block User List"
      users={homeProps.users.filter(user => user.status == "block")}
      onAppend={handleAppendUser}
      onDelete={handleDeleteUser}
    />
  );
}

export default CommentBlockListView