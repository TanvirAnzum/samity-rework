import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import UserForm from "../components/UserForm";
import { CirclePlus } from "lucide-react";
import useFirebase from "../hooks/useFirebase.js";
import Loading from "../components/Loading.jsx";

const Users = () => {
  /* state variables */
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(1000);
  const [date, setDate] = useState(null);
  const [options, setOptions] = useState("Add");
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  /* firebase hook */
  const { fetchUsers, isLoading } = useFirebase();

  const onEdit = (user) => {
    setOptions("Edit");
    setId(user?.id);
    setName(user?.name);
    setDate(user?.date);
    setAmount(user?.amount);
    setOpen(true);
  };

  const onDelete = (user) => {
    setOptions("Delete");
    setId(user?.id);
    setName(user?.name);
    //function for delete that user
    setOpen(true);
  };

  const onCreate = () => {
    setOptions("Add");
    setName("");
    setDate(null);
    setAmount(1000);
    setOpen(true);
  };

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user?.name.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  useEffect(() => {
    const loadUsers = async () => {
      const querySnapshot = await fetchUsers();
      const data = querySnapshot?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers([...data]);
    };
    loadUsers();
  }, [fetchUsers, refresh]);

  /* loading state */
  if (isLoading) return <Loading />;

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
        <div className="flex-1">
          <input
            placeholder="Search user..."
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={onCreate}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 w-full sm:w-auto"
        >
          <CirclePlus size={18} strokeWidth={2} />
          <span>Add</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredUsers?.map((u) => (
          <UserCard key={u.id} user={u} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <UserForm
        title={options + " User"}
        open={open}
        setOpen={setOpen}
        id={id}
        name={name}
        setName={setName}
        amount={amount}
        setAmount={setAmount}
        date={date}
        setDate={setDate}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default Users;
