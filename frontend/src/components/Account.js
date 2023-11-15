import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Card } from 'flowbite-react';

export const Account = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [teamDetails, setTeamDetails] = useState(null);
  const [token, setToken] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== retypePassword) {
      alert("New password and retype password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
    } catch (error) {
      console.log(error);
      alert("Password change failed. Please check your old password.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5001/team-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.team_details);
        setTeamDetails(response.data.team_details);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Card href="#" className="w-full mb-8 border-0">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white p-4 text-center">
          Team Details
        </h5>
        {teamDetails ? (
          <Table>
            <Table.Head>
              <Table.HeadCell>Team</Table.HeadCell>
              <Table.HeadCell>Email Address</Table.HeadCell>
              <Table.HeadCell>Platform</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {teamDetails.map((team) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={team.tid}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {team.status || "Not Specified"}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {team.teamname || "Not Specified"}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {team.platform || "Not Specified"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div class="shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div class="animate-pulse flex space-x-4">
              <div class="rounded-full bg-slate-700 h-10 w-10"></div>
              <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-slate-700 rounded"></div>
                <div class="space-y-3">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div class="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card href="#" className="w-full border-0">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white p-4 text-center">
          Set Password
        </h5>
        <form onSubmit={handleChangePassword}>
          <div className="mb-6">
            <label
              htmlFor="opassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Old Password
            </label>
            <input
              type="password"
              id="opassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="npassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              New password
            </label>
            <input
              type="password"
              id="npassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="rpassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Retype New Password
            </label>
            <input
              type="password"
              id="rpassword"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Change Password
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};