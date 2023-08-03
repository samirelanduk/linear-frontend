import React from "react";
import PropTypes from "prop-types";
import { statusColors } from "./states";

const Issue = props => {

  const { issue, expanded, collapsed, expand, collapse } = props;

  return (
    <div className={`text-base flex items-center gap-2 ${issue.parent ? "ml-10" : ""}`}>
      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${statusColors[issue.state.name]}`} />
      <div className="text-sm">{issue.title}</div>
      <div className="cursor-pointer">
        {expanded && <div onClick={collapse}>&uarr;</div>}
        {collapsed && <div onClick={expand}>&#8595;</div>}
      </div>
    </div>
  );
};

Issue.propTypes = {
  issue: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  expand: PropTypes.func.isRequired,
  collapse: PropTypes.func.isRequired,
};

export default Issue;