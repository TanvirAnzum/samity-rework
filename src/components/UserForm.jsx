import Modal from "./Modal";
import useFirebase from "../hooks/useFirebase.js";
import { Zap } from "lucide-react";

export default function UserForm({
  title,
  open,
  setOpen,
  id,
  name,
  setName,
  amount,
  setAmount,
  date,
  setDate,
  setRefresh,
}) {
  /* firebase hooks */
  const { createUser, editUser, removeUser } = useFirebase();

  const onSave = async (e) => {
    e.preventDefault();

    if (title === "Add User") {
      if (!name || !amount || !date) {
        alert("Please fill all the fields.");
        return;
      }
      await createUser({ name, amount: Number(amount), date });
      setRefresh((prev) => !prev);
    } else if (title === "Edit User") {
      if (!name || !amount || !date || !id) {
        alert("Please fill all the fields.");
        return;
      }

      await editUser(id, { name, amount: Number(amount), date });
      setRefresh((prev) => !prev);
    } else if (title === "Delete User") {
      if (!id) {
        alert("User ID is missing.");
        return;
      }
      await removeUser(id);
      setRefresh((prev) => !prev);
    }

    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen} title={title}>
      <form className="flex flex-col gap-2">
        {title !== "Delete User" && (
          <>
            <input
              placeholder="Name"
              type="text"
              value={name}
              className="border px-3 py-2 rounded-md w-full"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Monthly Amount"
              type="number"
              value={amount}
              className="border px-3 py-2 rounded-md w-full"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              placeholder="Joining Date"
              type="date"
              value={date}
              className="border px-3 py-2 rounded-md w-full"
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </>
        )}
        {title === "Delete User" && (
          <p>Are you sure you want to delete user "{name}"?</p>
        )}
        <button
          className={
            title === "Delete User"
              ? "bg-red-600 text-white w-full py-2 rounded-md mt-2"
              : "bg-blue-600 text-white w-full py-2 rounded-md mt-2"
          }
          onClick={onSave}
        >
          {title === "Delete User" ? "Delete" : "Save"}
        </button>
      </form>
    </Modal>
  );
}
