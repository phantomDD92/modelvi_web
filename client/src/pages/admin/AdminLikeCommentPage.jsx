import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";

import { PageMetaData } from "@/components/common"
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { AdminLikeCommentDialog, AdminLikeCommentTable } from "@/components/comment";
import { appendLikeComments, deleteLikeComment, deleteLikeComments, loadLikeComments } from "@/redux/admin/actions";

export const AdminLikeCommentPage = () => {

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();

  const page = parseInt(qs.parse(location.search)?.page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search)?.size) || DEFAULT_PAGE_SIZE;
  const search = qs.parse(location.search)?.search || '';
  const comments = useSelector(state => state.admin.likeComments);

  const loadLikeCommentsCallback = useCallback((search) => {
    setLoading(true);
    dispatch(loadLikeComments({ search }, () => setLoading(false)));
  }, [dispatch]);


  useEffect(() => {
    loadLikeCommentsCallback(search);
  }, [loadLikeCommentsCallback, search])

  useEffect(() => {
    const interval = setInterval(() => {
      loadLikeCommentsCallback(search);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleAppendComments = (comments) => {
    dispatch(appendLikeComments(comments, () => { setEditOpen(false); loadLikeCommentsCallback(search) }));
  }

  const handleDeleteComment = (comment) => {
    Modal.confirm({
      title: `Are you sure to delete the comment?`,
      onOk: () => { dispatch(deleteLikeComment(comment, () => loadLikeCommentsCallback(search))); },
    });
  }

  const handleDeleteComments = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} comments?`,
      onOk: () => dispatch(deleteLikeComments(selectedRowKeys, () => { setSelectedRowKeys([]); loadLikeCommentsCallback(search) })),
    });
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue, search }).toString()
    }, { replace: true });
  }

  return (
    <>
      <PageMetaData title="Like Bot Comments" admin />
      <AdminLikeCommentTable
        dataSource={comments}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
        actions={{
          onAppend: () => setEditOpen(true),
          onDelete: handleDeleteComment,
          onBulkDelete: handleDeleteComments,
        }}
      />
      <AdminLikeCommentDialog 
      open={editOpen}
      onCancel={() => setEditOpen(false)}
      onAppend={handleAppendComments}
      />

    </>
  )
}