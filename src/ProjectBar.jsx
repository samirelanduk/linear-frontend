import React from "react";
import PropTypes from "prop-types";
import { dayDiff } from "./utils";
import MilestoneBar from "./MilestoneBar";

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

  return (
    <div
      className="h-12 relative flex rounded overflow-hidden"
      style={{
        marginLeft: `${marginLeft}%`,
        marginRight: `${marginRight}%`,
      }}
    >
      {milestones.map((milestone, index) => (
        <MilestoneBar
          milestone={milestone}
          project={project}
          previous={milestones[index - 1]}
          isLast={index === milestones.length - 1}
          issuesByMilestoneId={issuesByMilestoneId}
          projectDaysWidth={projectDaysWidth}
        />
      ))}
    </div>
  );
};

ProjectBar.propTypes = {
  project: PropTypes.object.isRequired,
  periodStart: PropTypes.string.isRequired,
  periodEnd: PropTypes.string.isRequired,
};

export default ProjectBar;