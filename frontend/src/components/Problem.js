import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "flowbite-react";

export const Problem = () => {
  const { id } = useParams();
  const [problemDetails, setProblemDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5003/problem/${id}`)
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        setProblemDetails(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="border border-gray-200 rounded-lg shadow">
      <div className="relative overflow-x-auto p-4">
        {problemDetails ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Problem Details: {problemDetails.name} </h2>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Problem ID</Table.Cell>
                  <Table.Cell>{problemDetails.pid}</Table.Cell>
                  <Table.Cell>Input File Size</Table.Cell>
                  <Table.Cell>{/* Input file size data here */}</Table.Cell>
                  <Table.Cell>Submissions</Table.Cell>
                  <Table.Cell>{/* Submissions data here */}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Problem Code</Table.Cell>
                  <Table.Cell>{problemDetails.code}</Table.Cell>
                  <Table.Cell>Time Limit</Table.Cell>
                  <Table.Cell>{problemDetails.timelimit}</Table.Cell>
                  <Table.Cell>Points</Table.Cell>
                  <Table.Cell>{problemDetails.score}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Problem Statement</Table.Cell>
                  <Table.Cell colSpan="5">{problemDetails.statement}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Input</Table.Cell>
                  <Table.Cell colSpan="5">{problemDetails.input}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Output</Table.Cell>
                  <Table.Cell colSpan="5">{problemDetails.output}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </>
        ) : (
          <div
            role="status"
            class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 mx-auto"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
              <div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
              <div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
              <div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <div class="flex items-center justify-between pt-4">
              <div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};
