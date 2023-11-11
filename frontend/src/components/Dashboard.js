import React, { useState, useEffect } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [details, setDetails] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/admin")
      .then((response) => {
        setDetails(response.data.notice);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const contentWithLineBreaks = details.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="w-full text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Important Notice
      </h5>
      <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
        {contentWithLineBreaks}
      </p>
    </div>
  );
};
