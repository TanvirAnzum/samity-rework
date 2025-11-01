import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { CirclePlus, EllipsisVertical, FoldHorizontal } from "lucide-react";
import TransactionFilters from "../components/TransactionFilters";
import useFirebase from "../hooks/useFirebase";
import Loading from "../components/Loading";
import TransactionForm from "../components/TransactionForm";
import TransactionCard from "../components/TransactionCard";

function getCurrentMonthAndYear() {
  const today = new Date();
  const month = today.getMonth() + 1; // getMonth() is 0-indexed (0 = Jan)
  const year = today.getFullYear();
  return { month, year };
}

const Transactions = () => {
  /* get current month and year */
  const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();

  /* states */
  const [month, setMonth] = useState(currentMonth);
  const [open, setOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("month");
  const [year, setYear] = useState(currentYear);
  const [userFilter, setUserFilter] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  /* firebase hook */
  const { fetchTransactions, isLoading } = useFirebase();

  const onCreateTransaction = () => {
    /// do nothing
    setOpen(true);
  };

  const onApplyFilter = () => {
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      let filterOptions = {};

      if (filterMode === "month") {
        if (!month || !year) return;

        filterOptions.month = Number(month);
        filterOptions.year = Number(year);
      } else if (filterMode === "user") {
        if (!userFilter) return;

        filterOptions.name = userFilter;
      } else return;

      const querySnapshot = await fetchTransactions(filterMode, filterOptions);
      const data = querySnapshot?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!data) return;
      setTransactions([...data]);
    };

    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTransactions, refresh]);

  if (isLoading) <Loading />;

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        {/* Left Section: Adaptive Filter */}
        <TransactionFilters
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
        />

        {/* Right Section: Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Apply Filter Button */}
          <button
            onClick={onApplyFilter}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md transition-all duration-200 w-full sm:w-auto"
          >
            <span>Apply Filter</span>
          </button>

          {/* Add Transaction Button */}
          <button
            onClick={onCreateTransaction}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 w-full sm:w-auto"
          >
            <CirclePlus size={18} strokeWidth={2} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {transactions?.map((transaction) => (
          <TransactionCard
            key={transaction?.id}
            transaction={transaction}
            setOpen={setOpen}
            setMode={setMode}
            setSelectedTransaction={setSelectedTransaction}
          />
        ))}
      </div>
      <TransactionForm
        open={open}
        setOpen={setOpen}
        mode={mode}
        setRefresh={setRefresh}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
};

export default Transactions;
