import React from "react";
import PropTypes from "prop-types";
import { statusColors } from "./states";

const Issue = props => {

  const { issue, expanded, collapsed, expand, collapse } = props;

  const arrowClass = "text-xs";

  return (
    <div className={`text-base flex items-center gap-2 ${issue.parent ? "ml-5" : ""}`}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[issue.state.name]}`} />
      <div className="text-xs font-medium text-slate-700">{issue.title}</div>
      <div className="cursor-pointer">
        {expanded && <div onClick={collapse} className={arrowClass}>&uarr;</div>}
        {collapsed && <div onClick={expand} className={arrowClass}>&#8595;</div>}
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