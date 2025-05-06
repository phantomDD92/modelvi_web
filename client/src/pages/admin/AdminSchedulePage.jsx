import { PageMetaData } from "@/components/common";
import AdminScheduleDialog from "@/components/schedule/AdminScheduleDialog";
import AdminScheduleTable from "@/components/schedule/AdminScheduleTable";
import { appendSchedulePostForAdmin, deleteSchedulePostForAdmin, getSchedulePostsForAdmin, loadAgencyListForAdmin, loadModelListForAdmin, updateSchedulePostForAdmin } from "@/redux/admin/actions";
import { Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminSchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [post, setPost] = useState();
  const [agency, setAgency] = useState('');
  const [model, setModel] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const agencyList = useSelector(state => state.admin.agencyList);
  const modelList = useSelector(state => state.admin.modelList);
  const schedules = useSelector(state => state.admin.schedules);
  const schedulesCount = useSelector(state => state.admin.schedulesCount);

  useEffect(() => {
    dispatch(loadAgencyListForAdmin())
  }, [loadAgencyListForAdmin]);

  useEffect(() => {
    dispatch(loadModelListForAdmin())
  }, [loadModelListForAdmin]);

  const loadSchedulePostsCallback = useCallback(({ agency, model, page }) => {
    setLoading(true);
    dispatch(getSchedulePostsForAdmin({ agency, model, page }, () => setLoading(false)))
  }, [dispatch]);

  useEffect(() => {
    loadSchedulePostsCallback({ agency, model, page })
  }, [loadSchedulePostsCallback, agency, model, page]);

  const handleUpdateSchedule = (params) => {
    if (post) {
      dispatch(updateSchedulePostForAdmin(post, params, () => { setEditOpen(false); loadSchedulePostsCallback({ agency, model, page }) }))
    } else {
      dispatch(appendSchedulePostForAdmin(params, () => { setEditOpen(false); loadSchedulePostsCallback({ agency, model, page }) }))
    }
  }

  const handleDeleteSchedule = (post) => {
    Modal.confirm({
      title: `Are you sure to delete the scheduled post?`,
      onOk: () => dispatch(deleteSchedulePostForAdmin(post, () => loadSchedulePostsCallback({ agency, model, page }))),
    });
  }
  return (
    <>
      <PageMetaData title="Scheduled Posts" admin />
      <AdminScheduleTable
        loading={loading}
        dataSource={schedules}
        filters={{
          model,
          modelList,
          onModelChange: value => setModel(value),
          agency,
          agencyList,
          onAgencyChange: value => { setAgency(value); setModel(''); }
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
      <AdminScheduleDialog
        open={editOpen}
        data={post}
        agencyList={agencyList}
        modelList={modelList}
        onCancel={() => setEditOpen(false)}
        onUpdate={handleUpdateSchedule}
      />
    </>
  )
}

export default AdminSchedulePage;