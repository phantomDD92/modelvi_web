import { useCallback, useEffect, useState } from "react";
import { PageMetaData } from "@/components/common"
import { AgencyScheduleDialog, AgencyScheduleTable } from "@/components/schedule";
import { useDispatch, useSelector } from "react-redux";
import { appendSchedulePost, deleteSchedulePost, deleteScheduleResult, getSchedulePosts, getScheduleResults, loadAccountList, loadModelList, resetScheduleResult, updateSchedulePost } from "@/redux/v2/actions";
import { Modal } from "antd";
import AgencyScheduleResultTable from "@/components/schedule/AgencyScheduleResultTable";

const AgencySchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [post, setPost] = useState();
  const [model, setModel] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [status, setStatus] = useState('');
  const [platform, setPlatform] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const modelList = useSelector(state => state.v2.modelList);
  const scheduleResults = useSelector(state => state.v2.scheduleResults);
  const scheduleResultsCount = useSelector(state => state.v2.scheduleResultsCount);

  const loadScheduleResultsCallback = useCallback(({ model, platform, status, page, pageSize }) => {
    setLoading(true);
    dispatch(getScheduleResults({ model, platform, status, page, pageSize }, () => setLoading(false)))
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadModelList())
  }, [loadModelList]);

  useEffect(() => {
    loadScheduleResultsCallback({ model, platform, status, page, pageSize })
  }, [loadScheduleResultsCallback, model, platform, status, page, pageSize]);

  const handleUpdateSchedule = (params) => {
    if (post) {
      dispatch(updateSchedulePost(post, params, () => { setEditOpen(false); loadScheduleResultsCallback({ model, platform, status, page, pageSize }) }))
    } else {
      dispatch(appendSchedulePost(params, () => { setEditOpen(false); loadScheduleResultsCallback({ model, platform, status, page, pageSize }) }))
    }
  }

  const handleDeleteSchedule = (result) => {
    Modal.confirm({
      title: `Are you sure to delete the scheduled post?`,
      onOk: () => dispatch(deleteScheduleResult(result, () => loadScheduleResultsCallback({ model, platform, status, page, pageSize }))),
    });
  }

  const handleRetrySchedule = (result) => {
    dispatch(resetScheduleResult(result, () => { loadScheduleResultsCallback({ model, platform, status, page, pageSize }) }))
  }

  return (
    <>
      <PageMetaData title="Scheduled Post" />
      <AgencyScheduleResultTable
        loading={loading}
        dataSource={scheduleResults}
        filters={{
          model,
          modelList,
          onModelChange: value => setModel(value),
          status,
          onStatusChange: value => setStatus(value),
          platform,
          onPlatformChange: value => setPlatform(value),
        }}
        pagination={{
          current: page,
          total: scheduleResultsCount,
          pageSize,
          onChange: (pageValue, pageSizeValue) => { setPage(pageValue); setPageSize(pageSizeValue) }
        }}
        actions={{
          onCreate: () => { setPost(); setEditOpen(true) },
          onDelete: handleDeleteSchedule,
          onRetry: handleRetrySchedule,
          // onEdit: (post) => { setPost(post); setEditOpen(true) },
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