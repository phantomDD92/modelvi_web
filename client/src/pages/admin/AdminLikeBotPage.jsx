import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";

import { PageMetaData } from "@/components/common"
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { AdminLikeBotDialog, AdminLikeBotSettingsDialog, AdminLikeBotTable } from "@/components/likebot";
import { changeLikeBotStatus, createLikeBot, deleteLikeBot, loadLikeBots, updateLikeBotSettings } from "@/redux/admin/actions";

export const AdminLikeBotPage = () => {

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const { platform } = useParams();

  const page = parseInt(qs.parse(location.search)?.page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search)?.size) || DEFAULT_PAGE_SIZE;
  const search = qs.parse(location.search)?.search || '';

  const likeBots = useSelector(state => state.admin.likeBots);

  const loadBotsCallback = useCallback((platform, search) => {
    setLoading(true);
    dispatch(loadLikeBots(platform, { search }, () => setLoading(false)));
  }, [dispatch]);


  useEffect(() => {
    loadBotsCallback(platform, search);
  }, [loadBotsCallback, platform, search])

  useEffect(() => {
    const interval = setInterval(() => {
      loadBotsCallback(platform, search);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangeStatus = (bot, status) => {
    dispatch(changeLikeBotStatus(bot, status, () => loadBotsCallback(platform, search)))
  }

  const handleAppendBots = (users) => {
    dispatch(createLikeBot(platform, users, () => { setEditOpen(false); loadBotsCallback(platform, search) }));
  }

  const handleDeleteBot = (bot) => {
    Modal.confirm({
      title: `Are you sure to delete the bot(${bot.email})?`,
      onOk: () => { dispatch(deleteLikeBot(bot, () => loadBotsCallback(platform, search))); },
    });
  }

  const handleChangeBulkBotsStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} accounts?`,
      // onOk: () => dispatch(updateAccountsStatusForAdmin(platform, selectedRowKeys, status, () => { setSelectedRowKeys([]); loadAccountsCallback(platform, search) })),
    });
  }

  const handleDeleteBulkBots = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} bots?`,
      // onOk: () => dispatch(deleteAccountsForAdmin(platform, selectedRowKeys, () => { setSelectedRowKeys([]); loadAccountsCallback(platform, search) })),
    });
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue, search }).toString()
    }, { replace: true });
  }

  const handleChangePlatform = (plat) => {
    navigate({
      pathname: `/admin/like/${plat}`
    }, { replace: true });
  }

  const handleUpdateSettings = (params) => {
    dispatch(updateLikeBotSettings(platform, params, () => { setSettingsOpen(false) }));
  }

  return (
    <>
      <PageMetaData title="Like Bots" admin />
      <AdminLikeBotTable
        platform={platform}
        dataSource={likeBots}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
        filters={{
          search,
          onSearchChange: value => {
            navigate({
              pathname: location.pathname,
              search: createSearchParams({ search: value, page: 1, size: pageSize }).toString()
            }, { replace: true });
          },
        }}
        actions={{
          onPlatform: handleChangePlatform,
          onCreate: () => { setEditOpen(true) },
          onDelete: handleDeleteBot,
          onStatus: handleChangeStatus,
          onBulkDelete: handleDeleteBulkBots,
          onBulkStatus: handleChangeBulkBotsStatus,
          onSettings: () => setSettingsOpen(true),
        }}
      />
      <AdminLikeBotDialog
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onAppend={handleAppendBots}
      />
      <AdminLikeBotSettingsDialog
        open={settingsOpen}
        settings={likeBots.length > 0 ? likeBots[0] : {}}
        onCancel={() => setSettingsOpen(false)}
        onUpdate={handleUpdateSettings}
      />
    </>
  )
}