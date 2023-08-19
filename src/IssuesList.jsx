import React from "react";
import PropTypes from "prop-types";
import Issue from "./Issue";

const IssuesList = props => {

  const { issues, organization, small } = props;

  const sortedIssues = issues.sort((a, b) => {
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
    <div className={`flex flex-col gap-2 ${props.className || ""}`}>
      {sortedIssues.map((issue, index) => (
        <Issue key={index} issue={issue} organization={organization} small={small} />
      ))}
    </div>
  )
};

IssuesList.propTypes = {
  issues: PropTypes.array.isRequired,
  organization: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

export default IssuesList;