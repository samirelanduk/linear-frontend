import React from "react";
import PropTypes from "prop-types";
import { dayDiff } from "./utils";
import { Tooltip } from "react-tooltip"

const ProjectBar = props => {

  const { project, periodStart, periodEnd } = props;

  const issuesByMilestoneId = project.issues.reduce((acc, val) => {
    const milestoneId = val.projectMilestone ? val.projectMilestone.id : null;
    if (!milestoneId) return acc;
    if (!acc[milestoneId]) acc[milestoneId] = [];
    acc[milestoneId].push(val);
    return acc;
  }, {});

  const daysWidth = dayDiff(periodStart, periodEnd) + 1;

  const daysSinceStart = dayDiff(periodStart, project.startDate);
  const marginLeft = daysSinceStart * 100 / daysWidth;

  const milestones = project.projectMilestones.nodes.filter(m => m.targetDate);
  if (milestones.length === 0) return null;
  const lastMilestone = milestones[milestones.length - 1];
  const daysUntilEnd = dayDiff(lastMilestone.targetDate, periodEnd);
  const marginRight = daysUntilEnd * 100 / daysWidth;

  const projectDaysWidth = dayDiff(project.startDate, lastMilestone.targetDate) + 1;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="h-12 relative flex rounded overflow-hidden"
      style={{
        marginLeft: `${marginLeft}%`,
        marginRight: `${marginRight}%`,
      }}
    >
      {milestones.map((milestone, index) => {
        let milestoneStart;
        if (index === 0) {
          milestoneStart = project.startDate;
        } else {
          milestoneStart = milestones[index - 1].targetDate;
          const dt = new Date(milestoneStart);
          dt.setDate(dt.getDate() + 1);
          milestoneStart = dt.toISOString().split("T")[0];
        }
        const milestoneWidthDays = dayDiff(milestoneStart, milestone.targetDate) + 1;
        const milestoneWidth = milestoneWidthDays * 100 / projectDaysWidth;

        const isLast = index === milestones.length - 1;

        const issues = issuesByMilestoneId[milestone.id] || [];
        const completedIssueCount = issues.filter(issue => issue.state.name === "Done").length;
        const remainingIssueCount = issues.length - completedIssueCount;
        const pcComplete = Math.round(completedIssueCount / issues.length * 100);

        let state = "";
        let className = "";

        // Is start date in the past?
        const startDateInPast = dayDiff(milestoneStart, today) > 0;

        // Is end date in the past?
        const endDateInPast = dayDiff(milestone.targetDate, today) > 0;

        // Is it done?
        const isDone = remainingIssueCount === 0;

        if (endDateInPast) {
          if (isDone) {
            state = "COMPLETED";
            className = "bg-blue-400 border-blue-800";
          } else {
            state = "OVRERDUE";
            className = "bg-red-400 border-red-800";
          }
        } else if (startDateInPast) {
          state = "ONGOING";
          className = "bg-green-300 border-green-800";
        } else {
          state = "UPCOMING";
          className = "bg-blue-200 border-blue-400";
        }

        
        return (
          <>
            <div
              className={`h-full text-xs flex justify-center text-green-600 items-center ${isLast ? "" : "border-r"} ${className}`}
              style={{width: `${milestoneWidth}%`}}
              data-tooltip-id={`milestone-${milestone.id}`}
              data-tooltip-float={true}
              data-tooltip-position-strategy="fixed"
            >
              {state === "ONGOING" && `${pcComplete}%`}
            </div>
            <Tooltip id={`milestone-${milestone.id}`}>
              <div>{project.name}</div>
              <div>{milestone.name}</div>
            </Tooltip>
          </>
        )
      })}
    </div>
  );
};

ProjectBar.propTypes = {
  
};

export default ProjectBar;