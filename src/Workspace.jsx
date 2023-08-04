import React from "react";
import PropTypes from "prop-types";
import Team from "./Team";

const Workspace = props => {

  const { name, issues } = props;

  const sortedByTeam = [...issues].sort((a, b) => {
    if (a.team.order < b.team.order) return -1;
    if (a.team.order > b.team.order) return 1;
    return 0;
  });

  const teams = sortedByTeam.reduce((acc, issue) => {
    const team = issue.team.name;
    if (!acc[team]) acc[team] = [];
    acc[team].push(issue);
    return acc;
  }, {});

  return (
    <div className="w-fit flex-shrink-0">
      <div className="text-3xl mb-5 text-slate-700 font-black">{name}</div>
      <div className="flex flex-col gap-8">
        {Object.entries(teams).map(([name, issues]) => (
          <Team key={name} name={name} issues={issues} />
        ))}
      </div>
    </div>
  );
};

Workspace.propTypes = {
  name: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired,
};

export default Workspace;