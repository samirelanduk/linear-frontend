import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";

const Project = props => {

  const { name, issues } = props;

  return (
    <div className="border-t pt-2">
      <div className="font-semibold mb-2 text-gray-500">{name}</div>
      <IssuesList issues={issues} />
    </div>
  );
};

Project.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
};

export default Project;