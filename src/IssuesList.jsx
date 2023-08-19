import React from "react";
import PropTypes from "prop-types";
import Issue from "./Issue";

const IssuesList = props => {

  const { issues, organization, small } = props;

  return (
    <div className={`flex flex-col gap-2 ${props.className || ""}`}>
      {issues.map((issue, index) => (
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