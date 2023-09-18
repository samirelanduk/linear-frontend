import React from "react";
import PropTypes from "prop-types";
import { dayDiff } from "./utils";
import { Tooltip } from "react-tooltip"

const ProjectBar = props => {

  const { project, periodStart, periodEnd } = props;

  const daysWidth = dayDiff(periodStart, periodEnd) + 1;

  const daysSinceStart = dayDiff(periodStart, project.startDate);
  const marginLeft = daysSinceStart * 100 / daysWidth;

  const milestones = project.projectMilestones.nodes.filter(m => m.targetDate);
  const lastMilestone = milestones[milestones.length - 1];
  const daysUntilEnd = dayDiff(lastMilestone.targetDate, periodEnd);
  const marginRight = daysUntilEnd * 100 / daysWidth;

  const projectDaysWidth = dayDiff(project.startDate, lastMilestone.targetDate) + 1;

  return (
    <div
      className="h-12 bg-blue-300 relative flex rounded"
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
        
        return (
          <>
            <div
              className={`h-full border-blue-500 ${isLast ? "" : "border-r"}`}
              style={{width: `${milestoneWidth}%`}}
              data-tooltip-id={`milestone-${milestone.id}`}
              data-tooltip-float={true}
            />
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