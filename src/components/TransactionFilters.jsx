export default function TransactionFilters({
  filterMode,
  setFilterMode,
  month,
  setMonth,
  year,
  setYear,
  userFilter,
  setUserFilter,
}) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let years = [];
  const currentYear = new Date().getFullYear();
  for (let y = 2024; y <= currentYear; y++) {
    years.push(y);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      {/* Category Selector */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full sm:w-auto"
        value={filterMode}
        onChange={(e) => setFilterMode(e.target.value)}
      >
        <option value="month">By Month</option>
        <option value="user">By User</option>
      </select>

      {/* Conditional Input */}
      {filterMode === "month" ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Month Dropdown */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full sm:w-auto"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months?.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full sm:w-auto"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years?.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Enter user name..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full sm:w-auto"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
      )}
    </div>
  );
}
