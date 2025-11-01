import { Edit3, Trash2, Calendar, DollarSign, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import useFirebase from "../hooks/useFirebase";
import Loading from "../components/Loading";

export default function UserCard({ user, onEdit, onDelete }) {
  const [savings, setSavings] = useState(0);

  /* firebase hook */
  const { getSavingsById, isLoading } = useFirebase();

  /* helper function to convert DD/MM/YYYY to MM/DD/YYYY */
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchSavings = async () => {
      const aggregateSnapshot = await getSavingsById(user.id);
      const totalSavings = aggregateSnapshot?.data().totalAmount || 0;
      setSavings(totalSavings);
    };

    fetchSavings();
  }, [getSavingsById, user.id]);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: User Info */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h2 className="text-base font-semibold text-gray-900 tracking-tight">
          {user.name}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-600">
          <p className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formatDate(user?.date)}</span>
          </p>

          <p className="flex items-center gap-1.5 mt-1 sm:mt-0">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span>
              Instalment:{" "}
              <span className="font-semibold text-blue-600">
                ${user?.amount.toLocaleString()}
              </span>
            </span>
          </p>

          <p className="flex items-center gap-1.5 mt-1 sm:mt-0">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>
              Savings:{" "}
              <span className="font-semibold text-emerald-600">${savings}</span>
            </span>
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 sm:pt-0 sm:border-t-0 sm:ml-4">
        <button
          onClick={() => onEdit(user)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-[0.97] transition"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(user)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.97] transition"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
