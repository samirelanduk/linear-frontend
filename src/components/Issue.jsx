import React from "react";
import PropTypes from "prop-types";

const Issue = props => {

  const { issue } = props;

  const isMe = issue.assignee?.isMe;

  const isOther = issue => !issue.assignee?.isMe && issue.children.every(child => isOther(child));
  const other = isOther(issue);

  if (other) return null;

  return (
    <div className={`${props.className || ""}`}>
      <div className={`py-px ${isMe ? "" : "text-gray-300"}`}>{issue.title}</div>
      <div>
        {issue.children.map(child => (
          <Issue key={child.id} issue={child} className="ml-4" />
        ))}
      </div>
    </div>
  );
};

Issue.propTypes = {
  issue: PropTypes.object.isRequired,
};

export default Issue;