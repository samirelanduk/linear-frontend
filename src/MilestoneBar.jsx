import React from "react";
import PropTypes from "prop-types";
import { dayDiff } from "./utils";
import { Tooltip } from "react-tooltip"

const MilestoneBar = props => {

  const { milestone, project, previous, isLast, issuesByMilestoneId, projectDaysWidth } = props;

  // What is the start date for the milestone?
  let milestoneStart;
  if (previous) {
    milestoneStart = previous.targetDate;
    const dt = new Date(milestoneStart);
    dt.setDate(dt.getDate() + 1);
    milestoneStart = dt.toISOString().split("T")[0];
  } else {
    milestoneStart = project.startDate;
  }

  // Milestone width in days
  const milestoneWidthDays = dayDiff(milestoneStart, milestone.targetDate) + 1;
  const milestoneWidth = milestoneWidthDays * 100 / projectDaysWidth;

  // Completion
  const issues = issuesByMilestoneId[milestone.id] || [];
  const completedIssueCount = issues.filter(issue => issue.state.name === "Done").length;
  const remainingIssueCount = issues.length - completedIssueCount;
  const pcComplete = Math.round(completedIssueCount / issues.length * 100);

  // State
  const today = new Date().toISOString().split("T")[0];
  const startDateInPast = dayDiff(milestoneStart, today) >= 0;
  const endDateInPast = dayDiff(milestone.targetDate, today) > 0;
  const isDone = remainingIssueCount === 0;
  let state = "";
  let className = "";
  if (endDateInPast) {
    if (isDone) {
      state = "COMPLETED";
      className = "bg-blue-400 border-blue-800";
    } else {
      state = "OVRERDUE";
      className = "bg-red-400 border-red-800";
    }
  } else if (startDateInPast) {
    if (isDone) {
      state = "COMPLETED";
      className = "bg-blue-400 border-blue-800";
    } else {
      state = "ONGOING";
      className = "bg-green-300 border-green-500";
    }
  } else {
    state = "UPCOMING";
    className = "bg-blue-200 border-blue-400";
  }

  const firstLastClass = `${isLast ? "rounded-r" : "border-r"} ${previous ? "" : "rounded-l"}`;

  return (
    <div
      className={`h-full text-xs flex justify-center text-green-600 items-center ${firstLastClass} ${className}`}
      style={{width: `${milestoneWidth}%`}}
      data-tooltip-id={`milestone-${milestone.id}`}
      data-tooltip-float={true}
      data-tooltip-position-strategy="fixed"
    >
      {state === "ONGOING" && `${pcComplete}%`}
      <Tooltip id={`milestone-${milestone.id}`}>
        <div  className="text-sm">{project.name}</div>
        <div  className="text-base">{milestone.name}</div>
      </Tooltip>
    </div>
  );
};

MilestoneBar.propTypes = {
  milestone: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  previous: PropTypes.object,
  isLast: PropTypes.bool.isRequired,
  issuesByMilestoneId: PropTypes.object.isRequired,
  projectDaysWidth: PropTypes.number.isRequired,
};

export default MilestoneBar;