import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";

const Team = props => {

  const { team, organization } = props;

  const issues = Object.values(organization.issues).filter(issue => issue.team.id === team.id);

  return (
    <div
      className="w-96 flex-shrink-0 border-2 rounded"
      style={{borderColor: `${team.color}80`, backgroundColor: `${team.color}08`}}
    >
      <div
        style={{borderColor: `${team.color}80`}}
        className="px-2 py-0.5 border-b-2 text-lg font-semibold text-slate-700"
      >
        {team.name}
      </div>
      {organization.issuesLoading && (
        <div className="flex justify-center items-center py-3">
          <ClipLoader color={team.color} size={48} cssOverride={{borderWidth: "4px"}} speedMultiplier={1.2} />
        </div>
      )}
      <div className="px-2 py-1 text-sm max-h-64 overflow-y-auto">
        {issues.map(issue => (
          <div key={issue.id}>
            {issue.title}
          </div> 
        ))}
      </div>
    </div>
  );
};

Team.propTypes = {
  team: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default Team;