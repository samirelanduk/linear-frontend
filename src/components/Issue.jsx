import React from "react";
import PropTypes from "prop-types";
import CalendarIcon from "../assets/calendar.svg?react";

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

  const stateColor = {
    "backlog": "border-gray-500",
    "unstarted": "border-white",
    "started": "border-orange-500",
    "completed": "border-green-500 bg-green-600 bg-opacity-60",
    "canceled": "border-gray-200",
  }[issue.state.type];

  return (
    <div className={`${props.className || ""}`}>
      <div className={`py-px flex items-center gap-1.5 ${isMe ? "" : "opacity-20"}`}>
        <div className={`size-4 border-2 rounded-full flex-shrink-0 ${stateColor}`} />
        <div>{issue.title}</div>
      </div>
      <div>
        {issue.dueDate && (
          <div className={`-mt-0.5 -ml-0.5 pl-6 text-2xs flex gap-0.5 ${overdue ? "text-red-500" : dueSoon ? "text-yellow-500" : dueLater ? "text-green-500" : ""} ${isMe ? "" : "opacity-50"}`}>
            <CalendarIcon className={`w-3 ${overdue ? "fill-red-500" : dueSoon ? "fill-yellow-500" : dueLater ? "fill-green-500" : ""}`} />
            {formatDate(issue.dueDate)}
          </div> 
        )}
      </div>
      <div className="flex flex-col gap-1 mt-1">
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