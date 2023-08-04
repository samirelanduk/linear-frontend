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
    <div key={name} className="flex flex-col w-120 bg-white border rounded py-3 px-4">
      <div className="text-2xl mb-3 font-medium text-gray-700">{name}</div>
      <div className="flex flex-col gap-4">
        {"" in projects && <IssuesList issues={projects[""]} />}
        {Object.entries(projects).filter(e => e[0] !== "").map(([name, issues]) => (
          <Project key={name} name={name} issues={issues} />
        ))}
      </div>
    </div>
  );
};

Team.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
};

export default Team;