import React, { useEffect } from "react";

import UserListComponent from "@/components/comment/UserListComponent";

const CommentWhiteListView = ({ }) => {
  return (
    <UserListComponent title="White User List" models={[]} />
  );
}

export default CommentWhiteListView