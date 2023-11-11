import React, { useState, useEffect } from "react";
import axios from "axios";

export const Rankings = () => {
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/groups");
        setGroups(response.data.groups);
      } catch (error) {
        console.error(error);
      }
    };
  
    const fetchDataTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/teams`);
        setTeams(response.data.teams);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);  

  return (
    <div className="border border-gray-200 rounded-lg shadow">
      <div className="relative overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Current Rankings
        </h2>
        <div>
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select an option
          </label>
          <select
            id="groupsselect"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>All Groups</option>
            {groups.length > 0 &&
              groups.map((group) => (
                <option key={group.gid} value={group.gid}>
                  {group.groupname}
                </option>
              ))}
          </select>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Rank
              </th>
              <th scope="col" className="px-6 py-3">
                Team
              </th>
              <th scope="col" className="px-6 py-3">
                Team Group
              </th>
              <th scope="col" className="px-6 py-3">
                Problem Solved / Attempted
              </th>
              <th scope="col" className="px-6 py-3">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4">{team.rank}</td>
                <td className="px-6 py-4">{team.teamname}</td>
                <td className="px-6 py-4">{team.groupname}</td>
                <td className="px-6 py-4">
                  {team.problemSolved} / {team.problemAttempted}
                </td>
                <td className="px-6 py-4">{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
