import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import Issue from "./Issue";

const Team = props => {

  const { team, organization } = props;

  const issues = Object.values(organization.issues).filter(issue => issue.team.id === team.id);
  const milestonesById = Object.values(organization.projects).reduce((acc, project) => {
    for (const milestone of project.milestones) {
      acc[milestone.id] = milestone;
    }
    return acc;
  }, {});

  // Sort issues by sort order
  issues.sort((a, b) => a.sortOrder - b.sortOrder);

  // Sort issues by sub-issue sort order
  issues.sort((a, b) => a.subIssueSortOrder - b.subIssueSortOrder);

  // Sort issues by project milestone
  issues.sort((a, b) => {
    if (a.projectMilestone === null && b.projectMilestone === null) return 0;
    if (a.projectMilestone === null) return 1;
    if (b.projectMilestone === null) return -1;
    return new Date(milestonesById[a.projectMilestone.id].sortOrder) - new Date(milestonesById[b.projectMilestone.id].sortOrder);
  });

  // Sort issues by project
  issues.sort((a, b) => {
    if (a.project === null && b.project === null) return 0;
    if (a.project === null) return 1;
    if (b.project === null) return -1;
    return a.project.id.localeCompare(b.project.id);
  });

  // Sort issues by state
  const stateOrder = ["backlog", "unstarted", "started", "completed", "canceled"];
  issues.sort((a, b) => stateOrder.indexOf(a.state.type) - stateOrder.indexOf(b.state.type));

  // Sort issues by due date
  issues.sort((a, b) => {
    if (a.dueDate === null && b.dueDate === null) return 0;
    if (a.dueDate === null) return 1;
    if (b.dueDate === null) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const issuesById = issues.reduce((acc, issue) => {
    acc[issue.id] = issue;
    return acc;
  }, {});
  for (const issue of Object.values(issuesById)) {
    issue.children = Object.values(issuesById).filter(child => child.parent?.id === issue.id);
  }
  for (const issue of Object.values(issuesById)) {
    if (issue.parent !== null) issue.parent = issuesById[issue.parent.id];
  }

  const parentIssues = Object.values(issuesById).filter(issue => issue.parent === null);

  return (
    <div
      className="max-w-128 min-w-72 flex-shrink-0 border-3 rounded-md"
      style={{borderColor: `${team.color}80`, backgroundColor: `${team.color}08`}}
    >
      <div
        style={{borderColor: `${team.color}80`}}
        className="px-4 py-0.5 border-b-3 text-lg font-semibold"
      >
        {team.name}
      </div>
      {organization.issuesLoading && (
        <div className="flex justify-center items-center py-3">
          <ClipLoader color={team.color} size={48} cssOverride={{borderWidth: "4px"}} speedMultiplier={1.2} />
        </div>
      )}
      {!organization.issuesLoading && (
        <div className="px-4 py-3 pr-6 text-sm max-h-96 overflow-y-auto flex flex-col gap-3">
          {parentIssues.map(issue => <Issue key={issue.id} issue={issue} organization={organization} />)}
        </div>
      )}
    </div>
  );
};

Team.propTypes = {
  team: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default Team;