import { useCallback, useEffect, useState } from "react";
import { PageMetaData } from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import { loadAgencyListForAdmin, loadTransactionsForAdmin } from "@/redux/admin/actions";
import AdminTransactionsTable from "@/components/finance/AdminTransactionsTable";

const AdminTransactionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [agency, setAgency] = useState('')
  const [type, setType] = useState('');

  const dispatch = useDispatch();
  const transactions = useSelector(state => state.admin.transactions)
  const transactionsCount = useSelector(state => state.admin.transactionsCount)
  const agencyList = useSelector(state => state.admin.agencyList);

  const loadTransactionsCallback = useCallback((page, type, agency) => {
    setLoading(true);
    dispatch(loadTransactionsForAdmin({ page, type, agency }, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadTransactionsCallback(page, type, agency)
  }, [loadTransactionsCallback, page, type, agency]);

  useEffect(() => {
    dispatch(loadAgencyListForAdmin());
  }, [loadAgencyListForAdmin]);

  const handleChangePagination = (pg) => {
    setPage(pg)
  }

  return (
    <>
      <PageMetaData title="Transactions" admin />
      <AdminTransactionsTable
        filters={{
          agency,
          agencyList,
          onAgencyChange: value => setAgency(value),
          type,
          onTypeChange: value => setType(value),
        }}
        loading={loading}
        pagination={{
          current: page,
          pageSize: 20,
          total: transactionsCount,
          onChange: handleChangePagination
        }}
        dataSource={transactions}
      />
    </>
  )
}

export default AdminTransactionsPage;