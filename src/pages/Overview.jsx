import { Users, CreditCard, DollarSign, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import useFirebase from "../hooks/useFirebase";
import Loading from "../components/Loading";

const valueObj = Object.freeze({
  TOTAL_USER: 0,
  TOTAL_TRANSACTIONS: 1,
  EXPECTED_MONTHLY_AMOUNT: 2,
  CURRENT_MONTH_AMOUNT: 3,
  TOTAL_SAVINGS: 4,
});

const stats = [
  {
    label: "Total Users",
    icon: <Users className="text-blue-500" />,
  },
  {
    label: "Total Transactions",
    icon: <CreditCard className="text-green-500" />,
  },
  {
    label: "Expected Monthly Amount",
    icon: <DollarSign className="text-amber-500" />,
  },
  {
    label: "Current Month's Amount",
    icon: <DollarSign className="text-emerald-500" />,
  },
  {
    label: "Total Savings",
    icon: <Wallet className="text-purple-500" />,
  },
];

const Overview = () => {
  const [val, setVal] = useState(() => Array(5).fill(0));
  const [unPaidUsers, setUnPaidUsers] = useState([]);

  /* firebase hook */
  const {
    TOTAL_USER,
    TOTAL_TRANSACTIONS,
    TOTAL_SAVINGS,
    EXPECTED_MONTHLY_AMOUNT,
    CURRENT_MONTH_AMOUNT,
  } = valueObj;
  const {
    getTotalUsers,
    getTotalMonthlyExpectedAmount,
    fetchMonthlySavings,
    fetchTotalSavings,
    fetchTransactionCount,
    fetchTransactions,
    fetchUsers,
    isLoading,
  } = useFirebase();

  useEffect(() => {
    const fetchStats = async () => {
      const totalUsers = await getTotalUsers();
      const expectedMonthlyAmount = await getTotalMonthlyExpectedAmount();
      const transactionCount = await fetchTransactionCount();
      const monthlySavings = await fetchMonthlySavings(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );
      const totalSavings = await fetchTotalSavings();

      let newVal = [...val];
      newVal[TOTAL_USER] = totalUsers?.data()?.count || 0;
      newVal[EXPECTED_MONTHLY_AMOUNT] =
        expectedMonthlyAmount?.data()?.totalAmount || 0;
      newVal[TOTAL_TRANSACTIONS] = transactionCount?.data()?.count || 0;
      newVal[CURRENT_MONTH_AMOUNT] = monthlySavings?.data()?.totalAmount || 0;
      newVal[TOTAL_SAVINGS] = totalSavings?.data()?.totalAmount || 0;

      setVal(newVal);
    };

    fetchStats();
  }, [
    EXPECTED_MONTHLY_AMOUNT,
    TOTAL_USER,
    getTotalMonthlyExpectedAmount,
    getTotalUsers,
  ]);

  useEffect(() => {
    const fetchUnpaidUsers = async () => {
      const unPaidUsersList = [];
      const isPaidUserMap = {};

      const filterOptions = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      };

      let querySnapshot = await fetchTransactions("month", filterOptions);
      querySnapshot?.docs?.forEach((doc) => {
        const data = doc.data();
        isPaidUserMap[data?.userId] = true;
      });

      querySnapshot = await fetchUsers();
      querySnapshot?.docs?.forEach((doc) => {
        if (!isPaidUserMap[doc?.id]) {
          unPaidUsersList.push(doc?.data()?.name);
        }
      });

      setUnPaidUsers(unPaidUsersList);
    };

    fetchUnpaidUsers();
  }, [fetchTransactions, fetchUsers]);

  if (isLoading) return <Loading />;

  return (
    <div className="pb-20 space-y-6">
      {/* --- Top Stats --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 border border-gray-100"
          >
            <div className="bg-gray-50 p-3 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-xl font-bold">{val[idx]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Unpaid Users --- */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <h2 className="text-red-700 font-semibold mb-3">
          Unpaid Users (This Month)
        </h2>
        <ul className="space-y-2">
          {unPaidUsers?.map((user) => (
            <li
              key={user}
              className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center"
            >
              <span className="font-medium text-red-400">{user}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
