import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import qs from 'query-string';

import { Modal } from "antd";

import {
  PageMetaData
} from "@/components/common";
import {
  ChatTeamTable,
  ChatTeamDialog
} from "@/components/chat";

import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_REFRESH_TIMEOUT
} from "@/utils/const";

import {
  changeChatTeamForAdmin,
  createChatTeamForAdmin,
  deleteChatTeamForAdmin,
  deleteChatTeamsForAdmin,
  loadChatTeamsForAdmin
} from "@/redux/admin/actions";
import ChatTeamDetailDialog from "@/components/chat/ChatTeamDetailDialog";

export const AdminChatTeamPage = () => {

  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const chatTeams = useSelector(state => state.admin.chatTeams);
  const chatTeamStats = useSelector(state => state.admin.chatTeamStats);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadChatTeamsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadChatTeamsForAdmin(() => setLoading(false)));
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
    dispatch(createChatTeamForAdmin(params, () => { setEditOpen(false); loadChatTeamsCallback(); }))
  }

  const handleUpdateTeam = (team, params) => {
    dispatch(changeChatTeamForAdmin(team, params, () => { setEditOpen(false); loadChatTeamsCallback(); }))
  }

  const handleBulkDeleteTeams = () => {
    const nonEmptyTeams = chatTeams
      .filter(team => selectedRowKeys.includes(team._id) && team.accounts && team.accounts.length > 0);
    if (nonEmptyTeams.length > 0) {
      toast.error(`Chat teams (${nonEmptyTeams.map(team => team.name).join(", ")}) are associated with some accounts`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} chat teams?`,
      onOk: () => { dispatch(deleteChatTeamsForAdmin(selectedRowKeys, () => { setSelectedRowKeys([]); loadChatTeamsCallback() })); },
    });
  }

  const handleDeleteTeam = (team) => {
    if (team.accounts && team.accounts.length > 0) {
      toast.error(`Chat team(${team.name}) is associated with some accounts.`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete the chat team (${team.name})?`,
      onOk: () => dispatch(deleteChatTeamForAdmin(team, () => { loadChatTeamsCallback() })),
    });
  }

  return (
    <>
      <PageMetaData title="Chat teams" />
      <ChatTeamTable
        loading={loading}
        dataSource={{ chatTeams, chatTeamStats }}
        actions={{
          onCreate: () => { setTeam(); setEditOpen(true); },
          onEdit: (team) => { setTeam(team); setEditOpen(true) },
          onDelete: handleDeleteTeam,
          onBulkDelete: handleBulkDeleteTeams,
          // onDetail: (team) => { setTeam(team); setDetailOpen(true) },
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
      <ChatTeamDetailDialog
        open={detailOpen}
        team={team}
        onCancel={() => setDetailOpen(false)}
      />
    </>
  );
};

export default AdminChatTeamPage;
