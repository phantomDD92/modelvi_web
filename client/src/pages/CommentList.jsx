import React, { useEffect, useState } from "react";
import { Button, Card, Form, Popconfirm, Table, Tooltip, Input, Modal, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { clearComments, createComment, deleteComment, loadComments } from "@/redux/dashboard/actions";
import CommentListView from "@/views/comment/CommentListView";
import CommentBlockListView from "@/views/comment/CommentBlockListView";
import CommentWhiteListView from "@/views/comment/CommentWhiteListView";

export const CommentListPage = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

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
