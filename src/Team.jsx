import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";
import Project from "./Project";

const Team = props => {

  const { name, issues } = props;

  const projects = issues.reduce((acc, issue) => {
    const project = issue.project?.name || "";
    if (!acc[project]) acc[project] = [];
    acc[project].push(issue);
    return acc;
  }, {});

  return (
    <div key={name} className="flex flex-col w-96 border rounded py-2 px-4">
      <div className="text-2xl mb-2 font-medium">{name}</div>
      {"" in projects && <IssuesList issues={projects[""]} />}
      {Object.entries(projects).filter(e => e[0] !== "").map(([name, issues]) => (
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