import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";

const Project = props => {

  const { name, issues } = props;

  return (
    <div>
      <div className="font-bold">{name}</div>
      <IssuesList issues={issues} />
    </div>
  );
};

Project.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
};

export default Project;