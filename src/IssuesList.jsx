import React from "react";
import PropTypes from "prop-types";
import Issue from "./Issue";

const IssuesList = props => {

  const { issues, organization, small, teams } = props;

  const teamsSortedByIssueCount = teams.sort((a, b) => {
    const aCount = issues.filter(issue => issue.team.id === a.id).length;
    const bCount = issues.filter(issue => issue.team.id === b.id).length;
    if (aCount < bCount) return -1;
    if (aCount > bCount) return 1;
    return 0;
  });

  const sortedIssues = issues.sort((a, b) => {
    if (a.sortOrder < b.sortOrder) return -1;
    if (a.sortOrder > b.sortOrder) return 1;
    return 0;
  }).sort((a, b) => {
    const aTeam = teams.find(team => team.id === a.team.id);
    const bTeam = teams.find(team => team.id === b.team.id);
    const aTeamIndex = teamsSortedByIssueCount.findIndex(team => team.id === aTeam.id);
    const bTeamIndex = teamsSortedByIssueCount.findIndex(team => team.id === bTeam.id);
    if (aTeamIndex < bTeamIndex) return -1;
    if (aTeamIndex > bTeamIndex) return 1;
    return 0;
  }).sort((a, b) => {
    const rank = {
      "Todo": 3,
      "In Progress": 2,
      "Held": 1,
    }
    if (rank[a.state.name] < rank[b.state.name]) return -1;
    if (rank[a.state.name] > rank[b.state.name]) return 1;
    return 0;
  });

  return (
    <div className={`flex flex-col ${props.className || ""}`}>
      {sortedIssues.map((issue, index) => (
        <Issue
          key={index} issue={issue} isLast={index === sortedIssues.length - 1}
          organization={organization} small={small} teams={teams} isFirst={index === 0}
        />
      ))}
    </div>
  )
};

IssuesList.propTypes = {
  issues: PropTypes.array.isRequired,
  organization: PropTypes.string.isRequired,
  small: PropTypes.bool,
  teams: PropTypes.array.isRequired,
};

export default IssuesList;