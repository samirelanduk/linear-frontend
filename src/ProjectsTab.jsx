import React from "react";
import PropTypes from "prop-types";

const ProjectsTab = props => {

  const { data } = props;

  // Get projects which have milestones
  const projects = [...Object.values(data)].reduce((acc, val) => {
    return [...acc, ...val.projects.map(p => ({...p, organization: val.organization}))]
  }, []).filter(p => p.projectMilestones.nodes.length > 0);

  if (projects.length === 0) return;

  for (const project of projects) {
    project.projectMilestones.nodes.sort((a, b) => {
      if (a.targetDate && b.targetDate) {
        if (a.targetDate < b.targetDate) return -1;
        if (a.targetDate > b.targetDate) return 1;
        return 0;
      }
      if (a.targetDate) return -1;
      if (b.targetDate) return 1;
      if (a.sortOrder < b.sortOrder) return -1;
      if (a.sortOrder > b.sortOrder) return 1;
      return 0;
    });
  }

  // What is the earliest date?
  const earliestDate = projects.reduce((acc, val) => {
    const date = val.startDate;
    if (!date) return acc;
    if (!acc) return date;
    if (date < acc) return date;
    return acc;
  }, null);

  // What is the latest date?
  const latestDate = projects.reduce((acc, val) => {
    const date = val.projectMilestones.nodes.reduce((acc, val) => {
      const date = val.targetDate;
      if (!date) return acc;
      if (!acc) return date;
      if (date > acc) return date;
      return acc;
    }, null);
    if (!date) return acc;
    if (!acc) return date;
    if (date > acc) return date;
    return acc;
  }, null);

  // What start date should be used?
  const startDate = earliestDate.split("-").slice(0, 2).join("-") + "-01";

  // What end date should be used?
  const lastMonth = latestDate.split("-")[1];
  const daysInLastMonth = lastMonth === "02" ? 28 : [4, 6, 9, 11].includes(parseInt(lastMonth)) ? 30 : 31;
  const endDate = latestDate.split("-").slice(0, 2).join("-") + `-${daysInLastMonth}`;

  // Function for getting the number of days between two dates in days
  const dayDiff = (date1, date2) => {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    const diff = dt2.getTime() - dt1.getTime();
    return diff / (1000 * 60 * 60 * 24);
  }

  // What is the width of the period in days
  const periodWidth = dayDiff(startDate, endDate) + 1;

  console.log(startDate, endDate, periodWidth)
  
  const projectHeight = 100;
  const projectPadding = 10;
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-gray-500"];
  

  return (
    <div className="pt-6 px-8">

      <div
        className="bg-gray-200 rounded py-4 flex flex-col gap-4 relative"
        style={{height: `${projectHeight * projects.length}px`}}
      >
        {projects.map((project, projectIndex) => {
          const milestones = project.projectMilestones.nodes.filter(m => m.targetDate);
          return milestones.map((milestone, milestoneIndex) => {
            // Start date of milestone
            let milestoneStartDate;
            if (milestoneIndex === 0) {
              milestoneStartDate = project.startDate;
            } else {
              milestoneStartDate = milestones[milestoneIndex - 1].targetDate;
              // Add day to start date
              const dt = new Date(milestoneStartDate);
              dt.setDate(dt.getDate() + 1);
              milestoneStartDate = dt.toISOString().split("T")[0];
            }

            // End date of milestone
            const milestoneEndDate = milestone.targetDate;

            // Width of milestone in days
            const milestoneWidth = dayDiff(milestoneStartDate, milestoneEndDate) + 1;

            
            // What is the top position?
            const top = projectHeight * projectIndex + projectPadding;
            
            // What is the left position?
            const daysSinceStart = dayDiff(startDate, milestoneStartDate);
            console.log(milestoneStartDate, milestoneEndDate, milestoneWidth, daysSinceStart)
            const left = daysSinceStart / periodWidth * 100;

            // What is the width?
            const width = milestoneWidth / periodWidth * 100;

            // What is the color?
            const index = projectIndex * projects.length + milestoneIndex;
            const color = colors[index % colors.length];

            return (
              <div
                className={`absolute ${color} opacity-70`}
                style={{
                  top: `${top}px`,
                  left: `${left}%`,
                  width: `${width}%`,
                  height: `${projectHeight - (2 * projectPadding)}px`,
                }}
              />
            )

            /* const top = projectHeight * projectIndex;
            if (milestoneIndex !== 0) return;
            const startDate = project.startDate;
            const endDate = milestone.targetDate;
            const start = dateToNumber(startDate, earliestDate);
            const end = dateToNumber(endDate, earliestDate);
            const milestoneWidth = end - start;
            return (
              <div
                className={`absolute ${colors[milestoneIndex % colors.length]} w-10}`}
                style={{
                  top: `${top}px`,
                  left: milestoneIndex, right: milestoneIndex + 10,
                  height: `${projectHeight}px`,
                }}
              />
            ) */
          })
        })}
      </div>

      <div className="flex flex-col gap-4">
        {projects.map((project, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="text-2xl font-semibold text-slate-700">{project.name} {project.startDate}</div>
            <div className="flex flex-col gap-2">
              {project.projectMilestones.nodes.map((milestone, index) => (
                <div key={index} className="flex items-baseline gap-2">
                  <div className="text-xl font-medium text-slate-700">{milestone.name}</div>
                  <div>{milestone.targetDate}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

ProjectsTab.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProjectsTab;