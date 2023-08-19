import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";
import { assignChildren } from "./utils";

const Project = props => {

  const { project, organization } = props;

  const issues = assignChildren(project.issues);

  return (
    <div>
      <div className="mb-3 font-medium text-xl text-slate-600">{project.name}</div>
      <IssuesList issues={issues} organization={organization} />
    </div>
  );
};

Project.propTypes = {
  project: PropTypes.object.isRequired,
  organization: PropTypes.string.isRequired,
};

export default Project;