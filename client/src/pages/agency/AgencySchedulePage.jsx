import { useCallback, useEffect, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { PageMetaData } from "@/components/common"
import { AgencyScheduleDialog, AgencyScheduleTable } from "@/components/schedule";
import { useDispatch, useSelector } from "react-redux";
import { appendSchedulePost, deleteSchedulePost, getSchedulePosts, loadAccountList, updateSchedulePost } from "@/redux/v2/actions";
import { Modal } from "antd";

const AgencySchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const platform = searchParams.get('platform') || "";
  const status = searchParams.get('status') || "";
  const page = parseInt(searchParams.get('page') || "1")
  const accountList = useSelector(state => state.v2.accountList);
  const schedules = useSelector(state => state.v2.schedules);
  const schedulesCount = useSelector(state => state.v2.schedulesCount);

  const loadSchedulePostsCallback = useCallback(({ platform, page, status }) => {
    setLoading(true);
    dispatch(getSchedulePosts({ platform, status, page }, () => setLoading(false)))
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAccountList())
  }, [loadAccountList]);

  useEffect(() => {
    loadSchedulePostsCallback({ platform, status, page })
  }, [loadSchedulePostsCallback, platform, status, page]);

  const handlePageChange = (pageValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        platform,
        page: pageValue
      }).toString()
    }, { replace: true });
  }

  const handlePlatformChange = (value) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        platform: value,
        status,
        page
      }).toString()
    }, { replace: true });
  }

  const handleStatusChange = (value) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        platform,
        status: value,
        page
      }).toString()
    }, { replace: true });
  }

  const handleUpdateSchedule = (params) => {
    if (post) {
      dispatch(updateSchedulePost(post, params, () => { setEditOpen(false); loadSchedulePostsCallback({ platform, status, page }) }))
    } else {
      dispatch(appendSchedulePost(params, () => { setEditOpen(false); loadSchedulePostsCallback({ platform, status, page }) }))
    }
  }

  const handleDeleteSchedule = (post) => {
    Modal.confirm({
      title: `Are you sure to delete the scheduled post?`,
      onOk: () => dispatch(deleteSchedulePost(post, () => loadSchedulePostsCallback({ platform, status, page }))),
    });
  }

  return (
    <>
      <PageMetaData title="Scheduled Post" />
      <AgencyScheduleTable
        loading={loading}
        dataSource={schedules}
        filters={{
          platform,
          status,
          onPlatformChange: handlePlatformChange,
          onStatusChange: handleStatusChange,
        }}
        pagination={{
          current: page,
          total: schedulesCount,
          onChange: handlePageChange,
        }}
        actions={{
          onCreate: () => setEditOpen(true),
          onDelete: handleDeleteSchedule,
          onEdit: (post) => { setPost(post); setEditOpen(true) },
        }}
      />
      <AgencyScheduleDialog
        open={editOpen}
        data={post}
        accountList={accountList}
        onCancel={() => setEditOpen(false)}
        onUpdate={handleUpdateSchedule}
      />
    </>
  )
}

export default AgencySchedulePage;