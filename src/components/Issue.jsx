import React from "react";
import PropTypes from "prop-types";

const Issue = props => {

  const { issue } = props;

  const isMe = issue.assignee?.isMe;

  const isOther = issue => !issue.assignee?.isMe && issue.children.every(child => isOther(child));
  const other = isOther(issue);

  if (other) return null;

  const soonThreshold = 1000 * 60 * 60 * 24 * 5;
  const dueDate = issue.dueDate && new Date(issue.dueDate);
  const fromNow = dueDate && dueDate.getTime() - Date.now();
  const overdue = dueDate && fromNow < 0;
  const dueSoon = dueDate && fromNow < soonThreshold;
  const dueLater = dueDate && fromNow >= soonThreshold;

  const formatDate = date => {
    const dt = new Date(date);
    const isThisYear = dt.getFullYear() === new Date().getFullYear();
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short", month: "short", day: "numeric", year: isThisYear ? undefined : "numeric"
    });
  }

  return (
    <div className={`${props.className || ""}`}>
      <div className="py-px">
        <div className={`${isMe ? "" : "text-gray-300"}`}>{issue.title}</div>
        {issue.dueDate && (
          <div className={`-mt-0.5 text-2xs ${overdue ? "text-red-500" : dueSoon ? "text-yellow-500" : dueLater ? "text-green-500" : ""} ${isMe ? "" : "opacity-50"}`}>
            {formatDate(issue.dueDate)}
          </div> 
        )}
      </div>
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