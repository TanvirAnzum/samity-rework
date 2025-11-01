// src/firebase/transactions.js
import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
  orderBy,
  getAggregateFromServer,
  sum,
  getCountFromServer,
} from "firebase/firestore";

const transactionsCollection = collection(db, "transactions");
const batch = writeBatch(db);

export const getTransactions = (filterMode, filterOptions) => {
  // Simple month filter example
  let q;

  if (filterMode === "month")
    q = query(
      transactionsCollection,
      where("month", "==", filterOptions.month),
      where("year", "==", filterOptions.year),
      orderBy("year", "desc"),
      orderBy("month", "desc"),
      orderBy("day", "desc")
    );
  else if (filterMode === "user")
    q = query(
      transactionsCollection,
      where("name", "==", filterOptions.name),
      orderBy("year", "desc"),
      orderBy("month", "desc"),
      orderBy("day", "desc")
    );

  return getDocs(q);
};

export const addTransaction = (mode, transaction) => {
  const { userId, name, amount, date, endDate, notes } = transaction;
  let [year, month, day] = date.split("-");

  year = Number(year);
  month = Number(month);
  day = Number(day);

  if (mode === "single")
    return addDoc(transactionsCollection, {
      userId,
      name,
      amount: Number(amount),
      year,
      month,
      day,
      notes: notes || "",
    });
  else if (mode === "batch") {
    let [end_year, end_month, end_day] = endDate.split("-");
    end_year = Number(end_year);
    end_month = Number(end_month);

    while (year < end_year || (year === end_year && month <= end_month)) {
      const transactionRef = doc(transactionsCollection);

      batch.set(transactionRef, {
        userId,
        name,
        amount: Number(amount),
        year,
        month,
        day,
        notes: notes || "",
      });

      month++;

      if (month > 12) {
        month = 1;
        year++;
      }
    }

    return batch.commit();
  }
};

export const updateTransaction = (id, updatedData) => {
  const transDoc = doc(db, "transactions", id);
  return updateDoc(transDoc, updatedData);
};

export const deleteTransaction = (id) => {
  const transDoc = doc(db, "transactions", id);
  return deleteDoc(transDoc);
};

export const getUserTotalSavings = (id) => {
  const q = query(transactionsCollection, where("userId", "==", id));
  return getAggregateFromServer(q, { totalAmount: sum("amount") });
};

export const getTransactionCount = () => {
  return getCountFromServer(transactionsCollection);
};

export const getMonthlySavings = (year, month) => {
  const q = query(
    transactionsCollection,
    where("month", "==", month),
    where("year", "==", year)
  );
  return getAggregateFromServer(q, { totalAmount: sum("amount") });
};

export const getTotalSavings = () => {
  return getAggregateFromServer(transactionsCollection, {
    totalAmount: sum("amount"),
  });
};

export const getTotalUsersSavings = () => {
  const q = query(transactionsCollection);
  return getAggregateFromServer(q, { totalAmount: sum("amount") });
};
