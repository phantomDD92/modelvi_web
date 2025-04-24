import { useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { PageMetaData } from "@/components/common"
import { AgencyScheduleDialog, AgencyScheduleTable } from "@/components/schedule";

const AgencySchedulePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [content, setContent] = useState();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const platform = searchParams.get('platform') || "";
  const page = parseInt(searchParams.get('page') || "1")

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
        content={content}
        onCancel={() => setEditOpen(false)}
        onUpdate={() => { }}
      />
    </>
  )
}

export default AgencySchedulePage;