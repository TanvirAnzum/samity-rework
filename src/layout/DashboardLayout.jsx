import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import useFirebase from "../hooks/useFirebase";
import Loading from "../components/Loading";
import { User, LayoutDashboard, ReceiptText } from "lucide-react";

const DashboardLayout = () => {
  let Icon = LayoutDashboard;

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logoutUser, isLoading } = useFirebase();
  const active = pathname.split("/")[2] || "overview";
  const handleNav = (page) => navigate(`/dashboard/${page}`);

  if (isLoading) return <Loading />;

  if (active === "users") Icon = User;
  else if (active === "transactions") Icon = ReceiptText;

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="flex items-center gap-2">
          <Icon className="text-gray-500" size={22} />
          <h1 className="text-lg font-semibold capitalize text-gray-800">
            {active}
          </h1>
        </div>
        <button
          onClick={logoutUser}
          className="text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
      <Outlet />
      <BottomNav active={active} setActive={handleNav} />
    </div>
  );
};

export default DashboardLayout;
