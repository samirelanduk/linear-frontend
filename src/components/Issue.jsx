import { useState } from "react";
import PropTypes from "prop-types";
import CalendarIcon from "../assets/calendar.svg?react";
import TriangleIcon from "../assets/triangle.svg?react";

const Issue = props => {

  const { issue, organization, states } = props;

  const [tasksCollapsed, setTasksCollapsed] = useState(null);

  const isMe = issue.assignee?.isMe;

  const collapsed = tasksCollapsed === null ? isMe : tasksCollapsed;

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
    "canceled": "border-red-300",
  }[issue.state.type];

  const project = issue.project && organization.projects[issue.project.id];
  const milestonesById = project && project.milestones.reduce((acc, milestone) => {
    acc[milestone.id] = milestone;
    return acc;
  }, {});
  const milestone = issue.projectMilestone && milestonesById[issue.projectMilestone.id];

  const subtasks = issue.children.filter(child => states.includes(child.state.type));

  return (
    <div className={`${props.className || ""}`}>
      <div className={`py-px flex items-center gap-1.5 ${isMe ? "" : "opacity-20"}`}>
        <div className={`size-4 border-2 rounded-full flex-shrink-0 ${stateColor}`} />
        <div>{issue.title}</div>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <div className="w-4 h-2 -mr-0.5" onClick={() => setTasksCollapsed(!collapsed)}>
          {subtasks.length > 0 && (
            <TriangleIcon className={`w-full relative bottom-1 h-auto fill-indigo-200 opacity-50 hover:opacity-80 cursor-pointer transition-[transform] ${collapsed ? "-rotate-90" : "rotate-0"}`} />
          )}
        </div>
        {issue.dueDate && (
          <div className={`text-2xs w-22 flex gap-0.5 -mt-px ${overdue ? "text-red-500" : dueSoon ? "text-yellow-500" : dueLater ? "text-green-500" : ""} ${isMe ? "" : "opacity-50"}`}>
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
      {subtasks.length > 0 && !collapsed && (
        <div className="flex flex-col gap-2 mt-2">
          {subtasks.map(child => (
            <Issue key={child.id} issue={child} organization={organization} states={states} className="ml-6" />
          ))}
        </div>
      )}
    </div>
  );
};

Issue.propTypes = {
  issue: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
};

export default Issue;