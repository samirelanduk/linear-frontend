import React from "react";
import PropTypes from "prop-types";
import Project from "./Project";

const ProjectsList = props => {

  const { projects, organization } = props;

  const projectsWithIssues = projects.filter(p => p.issues.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {projectsWithIssues.map((project, index) => (
        <Project key={index} project={project} organization={organization} />
      ))}
    </div>
  );
};

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  organization: PropTypes.string.isRequired,
};

export default ProjectsList;