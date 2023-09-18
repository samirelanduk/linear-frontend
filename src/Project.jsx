import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";
import { assignChildren } from "./utils";

const Project = props => {

  const { project, organization, teams } = props;

  const issues = assignChildren(project.issues).filter(
    issue => ["Todo", "In Progress", "Held", "Up Next"].includes(issue.state.name)
  );

  return (
    <div>
      <div className="mb-3 font-medium text-xl text-slate-600">{project.name}</div>
      <IssuesList issues={issues} organization={organization} teams={teams} />
    </div>
  );
};

Project.propTypes = {
  project: PropTypes.object.isRequired,
  organization: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired,
};

export default Project;