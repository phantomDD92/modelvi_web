import { PageMetaData } from "@/components/common";
import AdminScheduleDialog from "@/components/schedule/AdminScheduleDialog";
import AdminScheduleResultTable from "@/components/schedule/AdminScheduleResultTable";
import ScheduleRetryDialog from "@/components/schedule/ScheduleRetryDialog";
import { appendSchedulePostForAdmin, deleteSchedulePostForAdmin, deleteScheduleResultForAdmin, fixScheduleResults, getSchedulePostsForAdmin, getScheduleResultsForAdmin, loadAgencyListForAdmin, loadModelListForAdmin, resetScheduleResultForAdmin, updateSchedulePostForAdmin } from "@/redux/admin/actions";
import { Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminSchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [retryOpen, setRetryOpen] = useState(false);
  const [post, setPost] = useState();
  const [agency, setAgency] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('');
  const [platform, setPlatform] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState();

  const dispatch = useDispatch();
  const agencyList = useSelector(state => state.admin.agencyList);
  const modelList = useSelector(state => state.admin.modelList);
  // const schedules = useSelector(state => state.admin.schedules);
  // const schedulesCount = useSelector(state => state.admin.schedulesCount);
  const scheduleResults = useSelector(state => state.admin.scheduleResults);
  const scheduleResultsCount = useSelector(state => state.admin.scheduleResultsCount);

  useEffect(() => {
    dispatch(loadAgencyListForAdmin())
  }, [loadAgencyListForAdmin]);

  useEffect(() => {
    dispatch(loadModelListForAdmin())
  }, [loadModelListForAdmin]);

  // const loadSchedulePostsCallback = useCallback(({ agency, model, page }) => {
  //   setLoading(true);
  //   dispatch(getSchedulePostsForAdmin({ agency, model, page }, () => setLoading(false)))
  // }, [dispatch]);

  const loadScheduleResultsCallback = useCallback(({ agency, model, platform, status, page, pageSize }) => {
    setLoading(true);
    dispatch(getScheduleResultsForAdmin({ agency, model, platform, status, page, pageSize }, () => setLoading(false)))
  }, [dispatch]);

  useEffect(() => {
    loadScheduleResultsCallback({ agency, model, platform, status, page, pageSize })
  }, [loadScheduleResultsCallback, agency, model, platform, status, page, pageSize]);

  const handleUpdateSchedule = (params) => {
    if (post) {
      dispatch(updateSchedulePostForAdmin(post, params, () => { setEditOpen(false); loadScheduleResultsCallback({ agency, model, platform, status, page, pageSize }) }))
    } else {
      dispatch(appendSchedulePostForAdmin(params, () => { setEditOpen(false); loadScheduleResultsCallback({ agency, model, platform, status, page, pageSize }) }))
    }
  }

  const handleFixScheduleData = () => {
    dispatch(fixScheduleResults(() => { loadScheduleResultsCallback({ agency, model, platform, status, page, pageSize }) }))
  }

  const handleRetrySchedule = (scheduledAt) => {
    dispatch(resetScheduleResultForAdmin(current, scheduledAt, () => { setRetryOpen(false); loadScheduleResultsCallback({ agency, model, platform, status, page, pageSize }) }))
  }

  const handleDeleteSchedule = (result) => {
    Modal.confirm({
      title: `Are you sure to delete the scheduled post?`,
      onOk: () => dispatch(deleteScheduleResultForAdmin(result, () => loadScheduleResultsCallback({ agency, model, platform, status, page, pageSize }))),
    });
  }

  return (
    <>
      <PageMetaData title="Scheduled Posts" admin />
      {/* <AdminScheduleTable
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
          onCreate: () => { setPost(); setEditOpen(true) },
          onDelete: handleDeleteSchedule,
          onEdit: (post) => { setPost(post); setEditOpen(true) },
        }}
      /> */}
      <AdminScheduleResultTable
        loading={loading}
        dataSource={scheduleResults}
        filters={{
          model,
          modelList,
          onModelChange: value => setModel(value),
          agency,
          agencyList,
          onAgencyChange: value => { setAgency(value); setModel(''); },
          status,
          onStatusChange: value => setStatus(value),
          platform,
          onPlatformChange: value => setPlatform(value),
        }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: scheduleResultsCount,
          onChange: (pageValue, pageSizeValue) => { setPage(pageValue); setPageSize(pageSizeValue) }
        }}
        actions={{
          onCreate: () => { setPost(); setEditOpen(true) },
          onDelete: handleDeleteSchedule,
          onFix: handleFixScheduleData,
          onRetry: result => { setCurrent(result); setRetryOpen(true) },
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
      <ScheduleRetryDialog
        data={current}
        open={retryOpen}
        onCancel={() => setRetryOpen(false)}
        onConfirm={handleRetrySchedule}
      />
    </>
  )
}

export default AdminSchedulePage;