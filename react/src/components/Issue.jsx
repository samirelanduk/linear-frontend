import { useState } from "react";
import PropTypes from "prop-types";
import CalendarIcon from "../assets/calendar.svg?react";
import TriangleIcon from "../assets/triangle.svg?react";
import { formatDate } from "../utils";
import ProjectLink from "./ProjectLink";
import StateIndicator from "./StateIndicator";
import Labels from "./Labels";

const Issue = props => {

  const { issue, organization, states, stateIds } = props;

  const [tasksCollapsed, setTasksCollapsed] = useState(null);

  const isMe = issue.assignee?.isMe;

  const collapsed = tasksCollapsed === null ? isMe : tasksCollapsed;

  const isOther = issue => !issue.assignee?.isMe && issue.children.every(child => isOther(child));
  const other = isOther(issue);

  if (other) return null;

  const project = issue.project && organization.projects[issue.project.id];
  const milestonesById = project && project.milestones.reduce((acc, milestone) => {
    acc[milestone.id] = milestone;
    return acc;
  }, {});
  const milestone = issue.projectMilestone && milestonesById[issue.projectMilestone.id];
  
  const dueDateObj = issue.dueDate && new Date(issue.dueDate);
  const subtaskDueDateObj = issue.subtaskDueDate && new Date(issue.subtaskDueDate);
  const milestoneDueDateObj = milestone && milestone.targetDate && new Date(milestone.targetDate);
  const projectDueDateObj = project && project.targetDate && new Date(project.targetDate);
  const allDueDates = [dueDateObj, subtaskDueDateObj, milestoneDueDateObj, projectDueDateObj].filter(Boolean);
  allDueDates.sort((a, b) => a - b);
  
  const dueDateToUseString = issue.subtaskDueDate || issue.dueDate || issue.milestoneDueDate || issue.projectDueDate;
  const dueDateToUse = dueDateToUseString ? new Date(dueDateToUseString) : null;

  const isSubtaskDueDate = subtaskDueDateObj && subtaskDueDateObj.getTime() === dueDateToUse.getTime();

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const soonThreshold = 5;
  const daysFromNow = Math.round((dueDateToUse && dueDateToUse.getTime() - now.getTime()) / 1000 / 60 / 60 / 24);
  const overdue = dueDateToUse && daysFromNow < 0;
  const dueSoon = dueDateToUse && daysFromNow < soonThreshold;
  const dueLater = dueDateToUse && daysFromNow >= soonThreshold;

  const subtasks = issue.children.filter(child => states.includes(child.state.type));

  return (
    <div className={`${props.className || ""}`}>
      <div className={`py-px flex items-center gap-1.5 ${isMe ? "" : "opacity-20"}`}>
        <StateIndicator issue={issue} stateIds={stateIds} />
        <a
          href={`https://linear.app/${organization.urlKey}/issue/${issue.identifier}`}
          target="_blank"
          rel="noreferrer"
        >{issue.title}</a>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <div className="w-4 h-2 -mr-0.5" onClick={() => setTasksCollapsed(!collapsed)}>
          {subtasks.length > 0 && (
            <TriangleIcon className={`w-full relative bottom-1 h-auto fill-indigo-200 opacity-50 hover:opacity-80 cursor-pointer transition-[transform] ${collapsed ? "-rotate-90" : "rotate-0"}`} />
          )}
        </div>
        {dueDateToUse && (
          <div className={`text-2xs w-22 flex gap-0.5 -mt-px ${isSubtaskDueDate ? "italic opacity-70" : ""} ${overdue ? "text-red-500" : dueSoon ? "text-yellow-500" : dueLater ? "text-green-500" : ""} ${isMe ? "" : "opacity-50"}`}>
            <CalendarIcon className={`w-3 ${overdue ? "fill-red-500" : dueSoon ? "fill-yellow-500" : dueLater ? "fill-green-500" : ""}`} />
            {formatDate(dueDateToUse)}
          </div> 
        )}
        {issue.project && <ProjectLink issue={issue} organizationKey={organization.urlKey} />}
        {issue.labels.length > 0 && <Labels issue={issue} />}
      </div>
      {subtasks.length > 0 && !collapsed && (
        <div className="flex flex-col gap-2 mt-2">
          {subtasks.map(child => (
            <Issue key={child.id} issue={child} organization={organization} states={states} stateIds={stateIds} className="ml-6" />
          ))}
        </div>
      )}
    </div>
  );
};

Issue.propTypes = {
  className: PropTypes.string,
  issue: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
  stateIds: PropTypes.object.isRequired,
};

export default Issue;