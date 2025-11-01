import {
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  MessageSquare,
} from "lucide-react";

export default function TransactionCard({
  transaction,
  setOpen,
  setMode,
  setSelectedTransaction,
}) {
  const { id, name, amount, day, month, year, notes } = transaction || {};

  const onEdit = () => {
    setMode("edit");
    setOpen(true);
    if (!transaction) {
      alert("Transaction is undefined");
      return;
    }
    setSelectedTransaction(transaction);
  };

  const onDelete = () => {
    setMode("delete");
    setOpen(true);
    if (!transaction) {
      alert("Transaction is undefined");
      return;
    }
    setSelectedTransaction(transaction);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: User Info */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h2 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-gray-900 tracking-tight">
          <span>{name}</span>
          {notes && (
            <span className="flex items-center gap-1 text-gray-500 text-sm font-normal italic">
              <MessageSquare size={14} className="text-gray-400 shrink-0" />
              <span className="break-words">{notes}</span>
            </span>
          )}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-600">
          <p className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{`${day}-${month}-${year}`}</span>
          </p>

          <p className="flex items-center gap-1.5 mt-1 sm:mt-0">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span>
              Amount:{" "}
              <span className="font-semibold text-blue-600">${amount}</span>
            </span>
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 sm:pt-0 sm:border-t-0 sm:ml-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-[0.97] transition"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.97] transition"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
