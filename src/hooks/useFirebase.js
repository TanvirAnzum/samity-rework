import { useState, useCallback } from "react";
import {
  login,
  logout,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getMonthlyExpectedAmount,
  getUserCount,
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getUserTotalSavings,
  getTransactionCount,
  getMonthlySavings,
  getTotalSavings,
} from "../firebase";

export default function useFirebase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsync = useCallback(async (callback) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callback();
      return result;
    } catch (err) {
      console.error("Firebase Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔐 AUTH
  const loginUser = useCallback(
    (email, password) => handleAsync(() => login(email, password)),
    [handleAsync]
  );

  const logoutUser = useCallback(
    () => handleAsync(() => logout()),
    [handleAsync]
  );

  // 👥 USERS
  const fetchUsers = useCallback(
    () => handleAsync(() => getUsers()),
    [handleAsync]
  );

  const createUser = useCallback(
    (data) => handleAsync(() => addUser(data)),
    [handleAsync]
  );

  const editUser = useCallback(
    (id, data) => handleAsync(() => updateUser(id, data)),
    [handleAsync]
  );

  const removeUser = useCallback(
    (id) => handleAsync(() => deleteUser(id)),
    [handleAsync]
  );

  const getTotalUsers = useCallback(
    () => handleAsync(() => getUserCount()),
    [handleAsync]
  );

  const getTotalMonthlyExpectedAmount = useCallback(
    () => handleAsync(() => getMonthlyExpectedAmount()),
    [handleAsync]
  );

  // 💳 TRANSACTIONS
  const fetchTransactions = useCallback(
    (filterMode, filterOptions) =>
      handleAsync(() => getTransactions(filterMode, filterOptions)),
    [handleAsync]
  );

  const createTransaction = useCallback(
    (mode, data) => handleAsync(() => addTransaction(mode, data)),
    [handleAsync]
  );

  const getSavingsById = useCallback(
    (id) => handleAsync(() => getUserTotalSavings(id)),
    [handleAsync]
  );

  const editTransaction = useCallback(
    (id, data) => handleAsync(() => updateTransaction(id, data)),
    [handleAsync]
  );

  const removeTransaction = useCallback(
    (id) => handleAsync(() => deleteTransaction(id)),
    [handleAsync]
  );

  const fetchMonthlySavings = useCallback(
    (year, month) => handleAsync(() => getMonthlySavings(year, month)),
    [handleAsync]
  );

  const fetchTotalSavings = useCallback(
    () => handleAsync(() => getTotalSavings()),
    [handleAsync]
  );

  const fetchTransactionCount = useCallback(
    () => handleAsync(() => getTransactionCount()),
    [handleAsync]
  );

  return {
    // States
    isLoading,
    error,

    // Auth
    loginUser,
    logoutUser,

    // Users
    fetchUsers,
    createUser,
    editUser,
    removeUser,
    getTotalUsers,
    getTotalMonthlyExpectedAmount,

    // Transactions
    fetchTransactions,
    createTransaction,
    editTransaction,
    removeTransaction,
    getSavingsById,
    fetchMonthlySavings,
    fetchTotalSavings,
    fetchTransactionCount,
  };
}
