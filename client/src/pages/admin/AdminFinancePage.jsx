import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AdminPaymentsPage from "./AdminPaymentsPage";
import AdminTransactionsPage from "./AdminTransactionPage";

const AdminFinancePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const key = params?.key || "payments";

  const tabItems = [
    { key: "payments", label: "Payments" },
    { key: "transactions", label: "Transactions" },
  ]

  const handleTabChange = (item) => {
    navigate(`/admin/finance/${item}`);
  }

  return (
    <div className="m-4">
      <Tabs
        type="card"
        activeKey={key}
        items={tabItems}
        onChange={handleTabChange}
      />
      {
        key == "payments"
          ? <AdminPaymentsPage />
          : key == "transactions"
            ? <AdminTransactionsPage />
            : <></>
      }
    </div>
  )
}

export default AdminFinancePage