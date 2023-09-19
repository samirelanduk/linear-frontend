import React from "react";
import PropTypes from "prop-types";
import ProjectBar from "./ProjectBar";

const ProjectsTab = props => {

  const { data } = props;

  const projectsByWorkspace = {};
  for (const [workspaceName, workspaceData] of Object.entries(data)) {
    projectsByWorkspace[workspaceName] = [];
    for (const project of workspaceData.projects) {
      if (project.projectMilestones.nodes.length === 0) continue;
      project.organization = workspaceData.organization;
      projectsByWorkspace[workspaceName].push(project);
    }
    if (projectsByWorkspace[workspaceName].length === 0) delete projectsByWorkspace[workspaceName];
  }

  // Get projects as flat list
  const projects = Object.values(projectsByWorkspace).reduce((acc, val) => [...acc, ...val], []);
  if (projects.length === 0) return;

  // Sort projects by start date and then by sort order
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
  
  // Points to do vertical lines
  const monthStarts = [];
  let dt = new Date(startDate);
  while (dt <= new Date(endDate)) {
    const day = dt.getDate();
    if (day === 1) monthStarts.push(dt.toISOString().split("T")[0]);
    dt.setDate(dt.getDate() + 1);
  }
  monthStarts.shift(0);

  const today = new Date().toISOString().split("T")[0];
  const todayLeft = dayDiff(startDate, today) / periodWidth * 100;

  return (
    <div className="pt-10 px-8">
      <div className="bg-gray-200 rounded py-4 flex flex-col gap-8 relative">
        {monthStarts.map((date, index) => {
          const left = dayDiff(startDate, date) / periodWidth * 100;
          const month = parseInt(date.split("-")[1]);
          const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];
          const label = month === 1 ? date.split("-")[0] : monthName;
          const screenClass = (month - 1) % 3 === 0 ? "" : "hidden sm:block";
          const className = `absolute text-xs text-gray-500 ${screenClass} ${month === 1 ? "-ml-3.5" : "-ml-3"}`
          return (
            <React.Fragment key={index}>
              <div
                className={`${className} -top-4`}
                style={{left: `${left}%`}}
              >
                {label}
              </div>
              <div
                className="absolute bg-gray-300"
                style={{top: 0, left: `${left}%`, width: "1px", height: "100%"}}
              />
              <div
                className={`${className} -bottom-4`}
                style={{left: `${left}%`}}
              >
                {label}
              </div>
            </React.Fragment>
          )
        })}
        <div
          className="absolute bg-gray-800 z-50"
          style={{top: 0, left: `${todayLeft}%`, width: "1px", height: "100%"}}
        />
        {Object.entries(projectsByWorkspace).map(([workspaceName, projects]) => (
          <div key={workspaceName}>
            <div className="text-lg text-center mb-2 font-medium">{workspaceName}</div>
            <div className="flex flex-col gap-4">
              {projects.map((project, index) => (
                <ProjectBar
                  key={index}
                  project={project}
                  periodStart={startDate}
                  periodEnd={endDate}
                />
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