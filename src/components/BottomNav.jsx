import { Home, Users, CreditCard, LogOut } from "lucide-react";

export const BottomNav = ({ active, setActive }) => {
  const navItems = [
    { name: "overview", icon: <Home size={20} /> },
    { name: "users", icon: <Users size={20} /> },
    { name: "transactions", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t flex justify-around py-2 z-50">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActive(item.name)}
          className={`flex flex-col items-center text-sm ${
            active === item.name ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {item.icon}
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
};
