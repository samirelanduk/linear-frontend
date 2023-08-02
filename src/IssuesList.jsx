import React from "react";
import PropTypes from "prop-types";

const IssuesList = props => {

  const { issues } = props;
  
  return (
    <div className="flex flex-col">
      {issues.map(issue => (
        <div key={issue.id} className="flex flex-col">
          <div className="text-base">{issue.title}</div>
        </div>
      ))}
    </div>
  );
};

IssuesList.propTypes = {
  issues: PropTypes.array.isRequired
};

export default IssuesList;