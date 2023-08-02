import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";
import Team from "./Team";

const Workspace = props => {

  const { name, issues } = props;

  const teams = issues.reduce((acc, issue) => {
    const team = issue.team.name;
    if (!acc[team]) acc[team] = [];
    acc[team].push(issue);
    return acc;
  }, {});

  return (
    <div>
      <div className="text-3xl">{name}</div>
      <div className="flex flex-col">
        {Object.entries(teams).map(([name, issues]) => (
          <Team key={name} name={name} issues={issues} />
        ))}
      </div>
    </div>
  );
};

Workspace.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
};

export default Workspace;