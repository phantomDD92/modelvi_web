import React from "react";
import { Row, Col } from "antd";
import CommentListView from "@/views/comment/CommentListView";
import CommentBlockListView from "@/views/comment/CommentBlockListView";

export const CommentListPage = () => {

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col span={12}>
          <CommentListView />
        </Col>
        <Col span={12} >
          <CommentBlockListView />
        </Col>
      </Row>
    </div>
  );
};

export default CommentListPage;
