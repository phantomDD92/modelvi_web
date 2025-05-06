import { useCallback, useEffect, useState } from "react";
import { PageMetaData } from "@/components/common"
import { AgencyScheduleDialog, AgencyScheduleTable } from "@/components/schedule";
import { useDispatch, useSelector } from "react-redux";
import { appendSchedulePost, deleteSchedulePost, getSchedulePosts, loadAccountList, loadModelList, updateSchedulePost } from "@/redux/v2/actions";
import { Modal } from "antd";

const AgencySchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [post, setPost] = useState();
  const [model, setModel] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const modelList = useSelector(state => state.v2.modelList);
  const schedules = useSelector(state => state.v2.schedules);
  const schedulesCount = useSelector(state => state.v2.schedulesCount);

  const loadSchedulePostsCallback = useCallback(({ model, page }) => {
    setLoading(true);
    dispatch(getSchedulePosts({ model, page }, () => setLoading(false)))
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadModelList())
  }, [loadModelList]);

  useEffect(() => {
    loadSchedulePostsCallback({ model, page })
  }, [loadSchedulePostsCallback, model, page]);

  const handleUpdateSchedule = (params) => {
    if (post) {
      dispatch(updateSchedulePost(post, params, () => { setEditOpen(false); loadSchedulePostsCallback({ model, page }) }))
    } else {
      dispatch(appendSchedulePost(params, () => { setEditOpen(false); loadSchedulePostsCallback({ model, page }) }))
    }
  }

  const handleDeleteSchedule = (post) => {
    Modal.confirm({
      title: `Are you sure to delete the scheduled post?`,
      onOk: () => dispatch(deleteSchedulePost(post, () => loadSchedulePostsCallback({ model, page }))),
    });
  }

  return (
    <>
      <PageMetaData title="Scheduled Post" />
      <AgencyScheduleTable
        loading={loading}
        dataSource={schedules}
        filters={{
          model,
          modelList,
          onModelChange: value => setModel(value),
        }}
        pagination={{
          current: page,
          total: schedulesCount,
          onChange: value => setPage(value),
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
        modelList={modelList}
        onCancel={() => setEditOpen(false)}
        onUpdate={handleUpdateSchedule}
      />
    </>
  )
}

export default AgencySchedulePage;