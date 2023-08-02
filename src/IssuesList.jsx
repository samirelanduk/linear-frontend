import React from "react";
import PropTypes from "prop-types";

const IssuesList = props => {

  const { issues } = props;

  const mapping = {};
  for (let issue of issues) {
    if (issue.parent) {
      mapping[issue.id] = issue.parent.id;
    }
  }
  const orderedIssues = [];
  for (let issue of issues) {
    if (issue.parent) continue
    orderedIssues.push(issue);
    if (Object.values(mapping).includes(issue.id)) {
      const children = issues.filter(e => e.parent && e.parent.id === issue.id);
      orderedIssues.push(...children);
    }
  }

  return (
    <div className="flex flex-col">
      {orderedIssues.map(issue => (
        <div key={issue.id} className="flex flex-col">
          <div className={`text-base ${issue.parent ? "ml-10" : ""}`}>{issue.title}</div>
        </div>
      ))}
    </div>
  );
};

IssuesList.propTypes = {
  issues: PropTypes.array.isRequired
};

export default IssuesList;