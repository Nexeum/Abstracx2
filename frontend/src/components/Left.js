import React, { useEffect, useState } from "react";
import axios from "axios";

export const LeftComponent = () => {
  const [problems, setProblems] = useState([]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    axios.get("http://localhost:5000/problems")
      .then((response) => {
        setProblems(response.data.problems);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return(
    <div className="w-1/6">
      <div className="border border-gray-200 rounded-lg shadow">
        <div className="relative overflow-x-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Contest Status</h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Mode
                </th>
                <td className="px-6 py-4">Disabled</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Judgement
                </th>
                <td className="px-6 py-4">Waiting</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Timer
                </th>
                <td className="px-6 py-4">NA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <div className="border border-gray-200 rounded-lg shadow">
        <div className="relative overflow-x-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Problem Index</h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Mode
                </th>
                <td className="px-6 py-4">Disabled</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Judgement
                </th>
                <td className="px-6 py-4">Waiting</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Timer
                </th>
                <td className="px-6 py-4">NA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );  
}
