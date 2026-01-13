import { useCallback, useEffect, useState } from "react";
import { PageMetaData } from "@/components/common";
import AdminPaymentsTable from "@/components/finance/AdminPaymentsTable";
import { useDispatch, useSelector } from "react-redux";
import { loadAgencyListForAdmin, loadPaymentsForAdmin } from "@/redux/admin/actions";

const AdminPaymentsPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('finished')
  const [agency, setAgency] = useState('')

  const dispatch = useDispatch();
  const payments = useSelector(state => state.admin.payments)
  const paymentsCount = useSelector(state => state.admin.paymentsCount)
  const agencyList = useSelector(state => state.admin.agencyList);

  const loadPaymentsCallback = useCallback((page, status, agency) => {
    setLoading(true);
    dispatch(loadPaymentsForAdmin({ page, status, agency }, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadPaymentsCallback(page, status, agency)
  }, [loadPaymentsCallback, page, status, agency]);

  useEffect(() => {
    dispatch(loadAgencyListForAdmin());
  }, [loadAgencyListForAdmin]);

  const handleChangePagination = (pg) => {
    setPage(pg)
  }

  return (
    <>
      <PageMetaData title="Payments" admin />
      <AdminPaymentsTable
        filters={{
          agency,
          agencyList,
          onAgencyChange: value => setAgency(value),
          status,
          onStatusChange: value => setStatus(value)
        }}
        loading={loading}
        pagination={{
          current: page,
          pageSize: 20,
          total: paymentsCount,
          onChange: handleChangePagination
        }}
        dataSource={payments}
      />
    </>
  )
}

export default AdminPaymentsPage;