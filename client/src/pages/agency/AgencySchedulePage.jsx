import { useCallback, useEffect, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { PageMetaData } from "@/components/common"
import { AgencyScheduleDialog, AgencyScheduleTable } from "@/components/schedule";
import { useDispatch, useSelector } from "react-redux";
import { appendSchedulePost, getSchedulePosts, loadAccountList } from "@/redux/v2/actions";

const AgencySchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [post, setPost] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const platform = searchParams.get('platform') || "";
  const page = parseInt(searchParams.get('page') || "1")
  const accountList = useSelector(state => state.v2.accountList);

  useEffect(() => {
    dispatch(loadAccountList())
  }, [loadAccountList]);

  const loadSchedulePostsCallback = useCallback(({ platform, page }) => {
    setLoading(true);
    dispatch(getSchedulePosts({ platform, page }, () => setLoading(false)))
  }, [dispatch]);

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
        page
      }).toString()
    }, { replace: true });
  }

  const handleUpdateSchedule = (params) => {
    if (post) {
      dispatch(appendSchedulePost(params, () => { setEditOpen(false); loadSchedulePostsCallback({ platform, page }) }))
    }
  }

  return (
    <>
      <PageMetaData title="Scheduled Post" />
      <AgencyScheduleTable
        dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(value => ({ _id: `${value}`, title: `title - ${value}` }))}
        filters={{
          platform,
          onPlatformChange: handlePlatformChange,
        }}
        pagination={{
          current: page,
          total: 14,
          onChange: handlePageChange,
        }}
        actions={{
          onCreate: () => setEditOpen(true),
        }}
      />
      <AgencyScheduleDialog
        open={editOpen}
        content={post}
        accountList={accountList}
        onCancel={() => setEditOpen(false)}
        onUpdate={handleUpdateSchedule}
      />
    </>
  )
}

export default AgencySchedulePage;