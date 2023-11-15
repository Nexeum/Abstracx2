import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const RightComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [serverStatus, setServerStatus] = useState("Waiting");
  const [serverVersion, setServerVersion] = useState("Unknown");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const responseData = response.data;
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserData(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  useEffect(() => {
    axios
      .get("http://localhost:5005/status")
      .then((response) => {
        setServerStatus(response.data.status);
        setServerVersion(response.data.version);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="w-1/6">
      <div className="border border-gray-200 rounded-lg shadow">
        <div className="relative overflow-x-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">API Status</h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Status
                </th>
                <td className="px-6 py-4">
                  {serverStatus === "UP" ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      {serverStatus}
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                      {serverStatus}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Version
                </th>
                <td className="px-6 py-4">{serverVersion}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg shadow mt-4">
        {userData ? (
          <div className="relative overflow-x-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Account</h2>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <tbody>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Team
                  </th>
                  <td className="px-6 py-4">{userData.teamname}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Score
                  </th>
                  <td className="px-6 py-4">{userData.score}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Solved
                  </th>
                  <td className="px-6 py-4">{userData.solved}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-center text-center">
              <button
                type="submit"
                onClick={handleLogout}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-x-auto p-4">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                Login
              </h5>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >
                  Team email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Log In
              </button>
              <Link to="/register">
                <div className="flex items-center justify-center text-center p-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    New Team?{" "}
                    <p className="text-blue-700 hover:underline dark:text-blue-500">
                      Click here to Register
                    </p>
                  </div>
                </div>
              </Link>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
