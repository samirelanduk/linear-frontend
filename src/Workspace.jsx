import React from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";
import ProjectsList from "./ProjectsList";
import { assignChildren } from "./utils";

const Workspace = props => {

  const { name, data } = props;
  const issues = assignChildren(data.issues);
  const held = issues.filter(issue => issue.state.name === "Held");
  const inProgress = issues.filter(issue => issue.state.name === "In Progress");
  const toDo = issues.filter(issue => issue.state.name === "Todo");

  return (
    <div className="pb-6">
      <div className="text-4xl mb-4 font-semibold text-slate-700 whitespace-nowrap">{name}</div>
      {held.length > 0 && (
        <IssuesList issues={held} organization={data.organization} className="mb-6" />
      )}
      {inProgress.length > 0 && (
        <IssuesList issues={inProgress} organization={data.organization} className="mb-6" />
      )}
      {toDo.length > 0 && (
        <IssuesList issues={toDo} organization={data.organization} className="mb-6" />
      )}
      <ProjectsList projects={data.projects} organization={data.organization} />
    </div>
  )
};

Workspace.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default Workspace;