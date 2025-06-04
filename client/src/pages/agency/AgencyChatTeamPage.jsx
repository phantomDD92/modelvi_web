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

import { changeChatTeam, createChatTeam, deleteChatTeam, deleteChatTeams, loadChatTeams } from "@/redux/v2/actions";

export const AgencyChatTeamPage = () => {

  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dispatch = useDispatch()
  const chatTeams = useSelector(state => state.v2.chatTeams);
  const chatTeamStats = useSelector(state => state.v2.chatTeamStats);
  
  const loadChatTeamsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadChatTeams(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadChatTeamsCallback();
  }, [loadChatTeamsCallback])

  const handleCreateTeam = (params) => {
    dispatch(createChatTeam(params, () => { setEditOpen(false); loadChatTeamsCallback(); }))
  }

  const handleUpdateTeam = (team, params) => {
    dispatch(changeChatTeam(team, params, () => { setEditOpen(false); loadChatTeamsCallback(); }))
  }

  const handleBulkDeleteTeams = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} chat teams?`,
      onOk: () => { dispatch(deleteChatTeams(selectedRowKeys, () => { setSelectedRowKeys([]); loadChatTeamsCallback() })); },
    });
  }

  const handleDeleteTeam = (team) => {
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
        dataSource={{chatTeams, chatTeamStats}}
        actions={{
          onCreate: () => { setTeam(); setEditOpen(true); },
          onEdit: (team) => { setTeam(team); setEditOpen(true) },
          onDelete: handleDeleteTeam,
          onBulkDelete: handleBulkDeleteTeams,
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
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

export default AgencyChatTeamPage;
