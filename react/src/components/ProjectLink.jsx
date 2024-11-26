import { useContext } from "react";
import PropTypes from "prop-types";
import { DataContext } from "../contexts";

const ProjectLink = props => {

  const { issue, organizationKey } = props;

  const [data,] = useContext(DataContext);

  const projectsById = {};
  const milestonesById = {};
  for (const organization of Object.values(data)) {
    for (const project of Object.values(organization.projects)) {
      projectsById[project.id] = project;
      for (const milestone of project.milestones) {
        milestonesById[milestone.id] = milestone;
      }
    }
  }

  const project = projectsById[issue.project.id];
  const milestone = issue.projectMilestone && milestonesById[issue.projectMilestone.id];

  return (
    <a
      href={`https://linear.app/${organizationKey}/project/${project?.slugId}${milestone ? `?projectMilestoneId=${milestone.id}` : ""}`}
      target="_blank" rel="noreferrer"
      className="text-2xs text-indigo-200 border border-indigo-200 opacity-50 rounded-md px-1.5"
    >
      {project.name}
      {milestone && ` - ${milestone.name}`}
    </a> 
  );
};

ProjectLink.propTypes = {
  issue: PropTypes.shape({
    project: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    projectMilestone: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  organizationKey: PropTypes.string.isRequired,
};

export default ProjectLink;