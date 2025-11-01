// src/firebase/users.js
import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getCountFromServer,
  getAggregateFromServer,
  sum,
} from "firebase/firestore";

const usersCollection = collection(db, "users");

export const getUsers = () => getDocs(usersCollection);

export const addUser = (user) => addDoc(usersCollection, user);

export const updateUser = (id, updatedData) => {
  const userDoc = doc(db, "users", id);
  return updateDoc(userDoc, updatedData);
};

export const deleteUser = (id) => {
  const userDoc = doc(db, "users", id);
  return deleteDoc(userDoc);
};

export const getUserCount = () => {
  return getCountFromServer(usersCollection);
};

export const getMonthlyExpectedAmount = () => {
  return getAggregateFromServer(usersCollection, {
    totalAmount: sum("amount"),
  });
};
