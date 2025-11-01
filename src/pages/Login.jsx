import { useState } from "react";
import useFirebase from "../hooks/useFirebase";

const Login = () => {
  const [password, setPassword] = useState("");
  const { loginUser } = useFirebase();

  const handleLogin = async () => {
    const email = import.meta.env.VITE_REACT_APP_USER_EMAIL_ID;
    if (password) {
      loginUser(email, password);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          className="border px-3 py-2 rounded-md w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 w-full rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
