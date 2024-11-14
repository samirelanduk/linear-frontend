import React from "react";
import PropTypes from "prop-types";

const Team = props => {

  const { team } = props;

  return (
    <div
      className="w-96 flex-shrink-0 border-2 rounded"
      style={{borderColor: team.color, backgroundColor: `${team.color}10`}}
    >
      <div
        style={{borderColor: team.color}}
        className="px-2 py-0.5 border-b-2 mb-4 font-semibold text-slate-700"
      >
        {team.name}
      </div>
    </div>
  );
};

Team.propTypes = {
  team: PropTypes.object.isRequired,
};

export default Team;