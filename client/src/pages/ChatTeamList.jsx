import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChatTeam, loadChatTeams } from "@/redux/model/actions";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import ChatTeamTable from "@/components/chat/ChatTeamTable";
import ChatTeamDialog from "@/components/chat/ChatTeamDialog";

export const ChatTeamList = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    setLoading(true);
    dispatch(loadChatTeams({ page, pageSize: 10 }, () => setLoading(false)));
  }, [loadChatTeams, page])


  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      dispatch(loadChatTeams({ page, pageSize: 10 }, () => setLoading(false)));
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleDeleteChatTeam = (team) => {
    dispatch(deleteChatTeam(team, handleReloadData));
  }

  const handleReloadData = () => {
    setOpen(false)
    setLoading(true);
    dispatch(loadChatTeams({ page, pageSize: 10 }, () => setLoading(false)));
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, { replace: true });
  }

  return (
    <>
      <ChatTeamTable
        loading={loading}
        teams={modelProps.teams}
        teamsCount={modelProps.teamsCount}
        onCreate={() => { setTeam(); setOpen(true) }}
        onEdit={(team) => { setTeam(team); setOpen(true) }}
        onDelete={handleDeleteChatTeam}
        page={page}
        onPageChange={handlePageChange}
      />
      <ChatTeamDialog
        open={open}
        team={team}
        onCancel={() => setOpen(false)}
        onUpdate={handleReloadData}
      />
    </>
  );
};

export default ChatTeamList;
