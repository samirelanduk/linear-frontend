import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";

const Team = props => {

  const { name, issues } = props;

  return (
    <div key={name} className="flex flex-col">
      <div className="text-2xl">{name}</div>
      <IssuesList issues={issues} />
    </div>
  );
};

Team.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
};

export default Team;