import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

export const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
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

  const showProblemDetails = (problem) => {
    setSelectedProblem(problem);
  };

  const groupedProblems = problems.reduce((grouped, problem) => {
    const pgroup = problem.pgroup;
    if (!grouped[pgroup]) {
      grouped[pgroup] = [];
    }
    grouped[pgroup].push(problem);
    return grouped;
  }, {});

  return (
    <div className="w-full text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <div className="relative overflow-x-auto">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white p-4">
            Problem Groups
          </h5>
          {Object.keys(groupedProblems).map((pgroup) => (
            <div key={pgroup} className="p-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white p-2">
                Group: {pgroup}
              </h3>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 p-4">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Problem Index
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Problem Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Problem Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Problem Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Problem Score
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Statistics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedProblems[pgroup].map((problem, index) => (
                    <tr
                      key={problem.pid}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      onclick={() => showProblemDetails(problem)}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {alphabet[index]}
                      </th>
                      <td className="px-6 py-4">
                        <Link to={`/problem/${problem.pid}`}> {problem.name}</Link>
                      </td>
                      <td className="px-6 py-4">{problem.code}</td>
                      <td className="px-6 py-4">{problem.type}</td>
                      <td className="px-6 py-4">{problem.score}</td>
                      <td className="px-6 py-4">Statistics</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
