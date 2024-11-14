import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import Issue from "./Issue";

const Team = props => {

  const { team, organization } = props;

  const issues = Object.values(organization.issues).filter(issue => issue.team.id === team.id);

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
      className="w-96 flex-shrink-0 border-2 rounded"
      style={{borderColor: `${team.color}80`, backgroundColor: `${team.color}08`}}
    >
      <div
        style={{borderColor: `${team.color}80`}}
        className="px-4 py-0.5 border-b-2 text-lg font-semibold text-slate-700"
      >
        {team.name}
      </div>
      {organization.issuesLoading && (
        <div className="flex justify-center items-center py-3">
          <ClipLoader color={team.color} size={48} cssOverride={{borderWidth: "4px"}} speedMultiplier={1.2} />
        </div>
      )}
      <div className="px-4 py-1 text-sm max-h-64 overflow-y-auto">
        {parentIssues.map(issue => <Issue key={issue.id} issue={issue} />)}
      </div>
    </div>
  );
};

Team.propTypes = {
  team: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default Team;