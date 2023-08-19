import React, { useState } from "react";
import PropTypes from "prop-types";
import IssuesList from "./IssuesList";

const Issue = props => {

  const { issue, organization, small, teams, isLast } = props;

  const statusColors = {
    "Todo": "bg-gray-300",
    "In Progress": "bg-yellow-300",
    "Held": "bg-red-300",
  };

  const color = statusColors[issue.state.name];

  const [expanded, setExpanded] = useState(false);

  const outerRing = small ? "w-3 h-3" : "w-5 h-5";
  const innerCore = small ? "w-2 h-2 left-0.5 top-0.5" : "w-3 h-3 left-1 top-1";
  const fontSize = small ? "text-xs" : "text-sm";
  const teamColor = teams.find(team => team.id === issue.team.id)?.color;

  return (
    <div className={`border-l-4 pl-2 ${isLast ? "" : "pb-2"}`} style={{borderColor: teamColor + "80"}}>
      <div className="flex gap-1.5 items-center">
        <div className={`rounded-full flex-shrink-0 relative ${outerRing} ${color}`}>
          <div className={`rounded-full bg-white absolute ${innerCore}`} />
        </div>
        <a
          href={`https://linear.app/${organization}/issue/${issue.identifier}`}
          className={`block whitespace-nowrap text-gray-700 ${fontSize}`}
          target="_blank" rel="noreferrer"
        >
          {issue.title}
        </a>
        {issue.children?.length > 0 && (
          <div className="cursor-pointer text-xs text-gray-300" onClick={() => setExpanded(!expanded)}>{expanded ? "▲" : "▼"}</div>
        )}
      </div>
      {expanded && (
        <IssuesList
          issues={issue.children}
          organization={organization}
          small
          teams={teams}
          className="ml-4 mt-2"
        />
      )}
    </div>
  )
};

Issue.propTypes = {
  issue: PropTypes.object.isRequired,
  organization: PropTypes.string.isRequired,
  small: PropTypes.bool,
  teams: PropTypes.array.isRequired,
};

export default Issue;