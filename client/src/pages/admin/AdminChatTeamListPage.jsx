import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import {
  createChatTeam,
  deleteChatTeam,
  loadChatTeams,
  changeChatTeam,
  deleteBulkChatTeams
} from "@/redux/model/actions";
import {
  ChatTeamTable,
  ChatTeamDialog
} from "@/components/chat";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { Modal } from "antd";
import toast from "react-hot-toast";
import PageMetaData from "@/components/common/PageMetaData";

export const AdminChatTeamListPage = () => {

  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const modelProps = useSelector(state => state.model);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadChatTeamsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadChatTeams(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadChatTeamsCallback();
  }, [loadChatTeamsCallback])

  useEffect(() => {
    const interval = setInterval(() => {
      loadChatTeamsCallback();
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleCreateTeam = (params) => {
    dispatch(createChatTeam(params, () => { setEditOpen(false); loadChatTeamsCallback(); }))
  }

  const handleUpdateTeam = (team, params) => {
    dispatch(changeChatTeam(team, params, () => { setEditOpen(false); loadChatTeamsCallback(); }))
  }

  const handleBulkDeleteTeams = () => {
    const nonEmptyTeams = modelProps.teams
      .filter(team => selectedRowKeys.includes(team._id) && team.accounts && team.accounts.length > 0);
    if (nonEmptyTeams.length > 0) {
      toast.error(`Chat teams (${nonEmptyTeams.map(team => team.name).join(", ")}) are associated with some accounts`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} chat teams?`,
      onOk: () => { dispatch(deleteBulkChatTeams(selectedRowKeys, () => { setSelectedRowKeys([]); loadChatTeamsCallback() })); },
    });
  }

  const handleDeleteTeam = (team) => {
    if (team.accounts && team.accounts.length > 0) {
      toast.error(`Chat team(${team.name}) is associated with some accounts.`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete the chat team (${team.name})?`,
      onOk: () => dispatch(deleteChatTeam(team, () => { loadChatTeamsCallback() })),
    });
  }

  return (
    <>
      <PageMetaData title="Chat teams" />
      <ChatTeamTable
        loading={loading}
        dataSource={modelProps.teams}
        actions={{
          onCreate: () => { setTeam(); setEditOpen(true); },
          onEdit: (team) => { setTeam(team); setEditOpen(true) },
          onDelete: handleDeleteTeam,
          onBulkDelete: handleBulkDeleteTeams,
        }}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
        page={page}

      />
      <ChatTeamDialog
        open={editOpen}
        team={team}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateTeam}
        onUpdate={handleUpdateTeam}
      />
    </>
  );
};

export default AdminChatTeamListPage;
