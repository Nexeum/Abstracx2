import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card} from "flowbite-react";
export const Submissions = () => {
  const [runs, setRuns] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [runsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5002/runs");
        setRuns(response.data.runs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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

  const resultMapping = {
    AC: "Accepted",
    WA: "Wrong Answer",
    PE: "Presentation Error",
    CE: "Compilation Error",
    RTE: "Run Time Error",
    TLE: "Time Limit Exceeded",
    DQ: "Disqualified",
    NA: "Unjudged",
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(runs.length / runsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const indexOfLastRun = currentPage * runsPerPage;
  const indexOfFirstRun = indexOfLastRun - runsPerPage;
  const currentRuns = runs.slice(indexOfFirstRun, indexOfLastRun);

  return (
    <div className="flex flex-col justify-center items-center">
      <Card href="#" className="w-full border-0">
        <h2 className="text-2xl font-bold mb-4 text-center p-4">
          Submission Status
        </h2>
        {runs ? (
          <div>
            <Table>
              <Table.Head>
                <Table.HeadCell>Run ID</Table.HeadCell>
                <Table.HeadCell>Team</Table.HeadCell>
                <Table.HeadCell>Problem</Table.HeadCell>
                <Table.HeadCell>Language</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Result</Table.HeadCell>
                <Table.HeadCell>Options</Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {currentRuns.map((run) => (
                  <Table.Row key={run.rid} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{run.rid}</Table.Cell>
                    <Table.Cell>{run.teamname}</Table.Cell>
                    <Table.Cell>{run.name}</Table.Cell>
                    <Table.Cell>{run.language}</Table.Cell>
                    <Table.Cell>{run.time}</Table.Cell>
                    <Table.Cell>{resultMapping[run.result]}</Table.Cell>
                    <Table.Cell>
                      {userData && userData.status === "Admin" ? (
                        <div>
                          <button
                            type="button"
                            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                          >
                            Rejudge
                          </button>
                          <button
                            type="button"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                          >
                            Private
                          </button>
                          <button
                            type="button"
                            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      ) : run.access !== "private" ? (
                        <button className="text-white bg-blue-700 font-bold hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          View
                        </button>
                      ) : null}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="flex items-center justify-center text-center p-4">
              <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-8 text-sm">
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 1 1 5l4 4"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from(
                    { length: Math.ceil(runs.length / runsPerPage) },
                    (_, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handlePageChange(index + 1)}
                          className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1
                              ? "text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover-bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        ) : (
          <div
            role="status"
            className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 mx-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Card>
    </div>
  );
};
