import React from "react";
import PropTypes from "prop-types";
import Issue from "./Issue";

const IssuesList = props => {

  const { issues } = props;

  const statusOrders = {
    "Held": 1,
    "In Progress": 2,
    "Todo": 3,
    "Backlog": 4,
    "Done": 5,
  }

  const sortedIssues = issues.sort((a, b) => {
    if (statusOrders[a.state.name] < statusOrders[b.state.name]) return -1;
    if (statusOrders[a.state.name] > statusOrders[b.state.name]) return 1;
    return 0;
  });

  const mapping = {};
  for (let issue of issues) {
    if (issue.parent) {
      mapping[issue.id] = issue.parent.id;
    }
  }
  const orderedIssues = [];
  for (let issue of sortedIssues) {
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
        <Issue key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

IssuesList.propTypes = {
  issues: PropTypes.array.isRequired
};

export default IssuesList;