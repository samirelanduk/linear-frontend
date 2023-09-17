import React from "react";
import PropTypes from "prop-types";

const ProjectsTab = props => {

  const { data } = props;

  const projects = [...Object.values(data)].reduce((acc, val) => {
    return [...acc, ...val.projects.map(p => ({...p, organization: val.organization}))]
  }, []).filter(p => p.projectMilestones.nodes.length > 0);

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


  

  return (
    <div className="ml-8 mt-4 flex flex-col gap-4">
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
  );
};

ProjectsTab.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProjectsTab;