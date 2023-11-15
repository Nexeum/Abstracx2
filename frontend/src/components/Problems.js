import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Table } from "flowbite-react";

export const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    axios.get("http://localhost:5003/problems")
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
    <div className="w-full text-center bg-white sm:p-8 dark:bg-gray-800">
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
              <Table>
                <Table.Head>
                  <Table.HeadCell>Problem ID</Table.HeadCell>
                  <Table.HeadCell>Problem Name</Table.HeadCell>
                  <Table.HeadCell>Problem Code</Table.HeadCell>
                  <Table.HeadCell>Problem Type</Table.HeadCell>
                  <Table.HeadCell>Score</Table.HeadCell>
                  <Table.HeadCell>Statistics</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {problems.map((problem, index) => (
                    <Table.Row
                      key={problem.pid}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      onClick={() => showProblemDetails(problem)}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {alphabet[index]}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/problem/${problem.pid}`}> {problem.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{problem.code}</Table.Cell>
                      <Table.Cell>{problem.type}</Table.Cell>
                      <Table.Cell>{problem.score}</Table.Cell>
                      <Table.Cell>Statistics</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
