import React from "react";
import PropTypes from "prop-types";

const Issue = props => {

  const { issue, expanded, collapsed, expand, collapse } = props;

  const statusColors = {
    "Todo": "bg-purple-200",
    "In Progress": "bg-yellow-400",
    "Done": "bg-green-200",
    "Backlog": "bg-gray-200",
    "Held": "bg-yellow-200"
  }

  return (
    <div className={`text-base flex items-center gap-2 ${issue.parent ? "ml-10" : ""}`}>
      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${statusColors[issue.state.name]}`} />
      <div>{issue.title}</div>
      <div className="cursor-pointer">
        {expanded && <div onClick={collapse}>&uarr;</div>}
        {collapsed && <div onClick={expand}>&#8595;</div>}
      </div>
    </div>
  );
};

Issue.propTypes = {
  issue: PropTypes.object.isRequired
};

export default Issue;