import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";
import Project from "./Project";

const Team = props => {

  const { name, issues } = props;

  const projects = issues.reduce((acc, issue) => {
    const project = issue.project?.name || null;
    if (!acc[project]) acc[project] = [];
    acc[project].push(issue);
    return acc;
  }, {});

  return (
    <div key={name} className="flex flex-col">
      <div className="text-2xl">{name}</div>
      {null in projects && <IssuesList issues={projects[null]} />}
      {Object.entries(projects).filter(e => e[0] !== null).map(([name, issues]) => (
        <Project key={name} name={name} issues={issues} />
      ))}
    </div>
  );
};

Team.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
};

export default Team;