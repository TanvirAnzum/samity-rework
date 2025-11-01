import { useEffect, useState } from "react";
import Modal from "./Modal";
import useFirebase from "../hooks/useFirebase";
import Loading from "./Loading";

export default function TransactionForm({
  open,
  setOpen,
  mode,
  setRefresh,
  selectedTransaction,
}) {
  const [amount, setAmount] = useState();
  const [date, setDate] = useState();
  const [endDate, setEndDate] = useState();
  const [notes, setNotes] = useState();
  const [type, setType] = useState("single");
  const [selectedUserId, setSelectedUserId] = useState();
  const [users, setUsers] = useState([]);

  /* firebase hook */
  const {
    fetchUsers,
    createTransaction,
    editTransaction,
    removeTransaction,
    isLoading,
  } = useFirebase();

  useEffect(() => {
    const loadUsers = async () => {
      const querySnapshot = await fetchUsers();
      const data = querySnapshot?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers([...data]);
      setSelectedUserId(data[0].id);
    };
    if (mode === "add") loadUsers();
    else if ((mode === "edit" || mode === "delete") && selectedTransaction) {
      setUsers([selectedTransaction]);
      setSelectedUserId(selectedTransaction.id);
      setAmount(selectedTransaction.amount);
    }
  }, [fetchUsers, mode, selectedTransaction]);

  const onSave = async (e) => {
    e.preventDefault();
    const userObj = users.find((user) => user.id === selectedUserId);
    const { id, name } = userObj;

    if (mode === "add") {
      if (!id || !name || !date || !type || !amount) return;

      if (type === "batch" && !endDate) return;

      await createTransaction(type, {
        userId: id,
        name,
        amount,
        date,
        endDate,
        notes,
      });

      setRefresh((prev) => !prev);
      setOpen(false);
    } else if (mode === "edit") {
      editTransaction(id, { amount });
      setRefresh((prev) => !prev);
      setOpen(false);
    } else if (mode === "delete") {
      removeTransaction(id);
      setRefresh((prev) => !prev);
      setOpen(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Transaction`}
    >
      <form className="flex flex-col gap-2">
        {/* User Select */}
        <label className="text-sm font-medium text-gray-700">User</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          disabled={mode !== "add"}
        >
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Amount */}
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={mode === "delete"}
        />

        {/* Type Select */}
        {mode === "add" && (
          <>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="single">Single</option>
              <option value="batch">Batch</option>
            </select>

            {/* Date / Start Date */}
            <label className="text-sm font-medium text-gray-700">
              {type === "batch" ? "Start Date" : "Date"}
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* End Date if Batch */}
            {type === "batch" && (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Note (Optional) */}
            <label className="text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <textarea
              placeholder="Add a note..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </>
        )}

        {mode === "delete" && (
          <div className="flex flex-col gap-4">
            <p>
              Are you sure you want to delete this transaction on{" "}
              {`${selectedTransaction?.day}-${selectedTransaction?.month}-${selectedTransaction?.year}`}
              ?
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          className={
            mode === "delete"
              ? "bg-red-600 text-white font-medium px-4 py-2 rounded-md mt-2 w-full hover:bg-red-700 transition-all duration-200"
              : "bg-blue-600 text-white font-medium px-4 py-2 rounded-md mt-2 w-full hover:bg-blue-700 transition-all duration-200"
          }
          onClick={onSave}
        >
          {mode === "delete" ? "Delete" : "Save"}
        </button>
      </form>
    </Modal>
  );
}
