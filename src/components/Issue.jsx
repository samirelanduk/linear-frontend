import React from "react";
import PropTypes from "prop-types";
import CalendarIcon from "../assets/calendar.svg?react";

const Issue = props => {

  const { issue, organization } = props;

  const isMe = issue.assignee?.isMe;

  const isOther = issue => !issue.assignee?.isMe && issue.children.every(child => isOther(child));
  const other = isOther(issue);

  if (other) return null;

  const soonThreshold = 1000 * 60 * 60 * 24 * 5;
  const dueDate = issue.dueDate && new Date(issue.dueDate);
  const fromNow = dueDate && dueDate.getTime() - Date.now();
  const overdue = dueDate && fromNow < 0;
  const dueSoon = dueDate && fromNow < soonThreshold;
  const dueLater = dueDate && fromNow >= soonThreshold;

  const formatDate = date => {
    const dt = new Date(date);
    const isThisYear = dt.getFullYear() === new Date().getFullYear();
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short", month: "short", day: "numeric", year: isThisYear ? undefined : "numeric"
    });
  }

  const stateColor = {
    "backlog": "border-gray-500",
    "unstarted": "border-white",
    "started": "border-orange-500",
    "completed": "border-green-500 bg-green-600 bg-opacity-60",
    "canceled": "border-gray-200",
  }[issue.state.type];

  const project = issue.project && organization.projects[issue.project.id];
  const milestonesById = project && project.milestones.reduce((acc, milestone) => {
    acc[milestone.id] = milestone;
    return acc;
  }, {});
  const milestone = issue.projectMilestone && milestonesById[issue.projectMilestone.id];

  return (
    <div className={`${props.className || ""}`}>
      <div className={`py-px flex items-center gap-1.5 ${isMe ? "" : "opacity-20"}`}>
        <div className={`size-4 border-2 rounded-full flex-shrink-0 ${stateColor}`} />
        <div>{issue.title}</div>
      </div>
      <div className="flex gap-2 items-center mt-1 -ml-0.5 pl-6">
        {issue.dueDate && (
          <div className={`text-2xs flex gap-0.5 -mt-px ${overdue ? "text-red-500" : dueSoon ? "text-yellow-500" : dueLater ? "text-green-500" : ""} ${isMe ? "" : "opacity-50"}`}>
            <CalendarIcon className={`w-3 ${overdue ? "fill-red-500" : dueSoon ? "fill-yellow-500" : dueLater ? "fill-green-500" : ""}`} />
            {formatDate(issue.dueDate)}
          </div> 
        )}
        {project && (
          <div className="text-2xs text-indigo-200 border border-indigo-200 opacity-50 rounded-md px-1.5">
            {project.name}
            {milestone && ` - ${milestone.name}`}
          </div> 
        )}
      </div>
      {issue.children.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {issue.children.map(child => (
            <Issue key={child.id} issue={child} organization={organization} className="ml-6" />
          ))}
        </div>
      )}
    </div>
  );
};

Issue.propTypes = {
  issue: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default Issue;