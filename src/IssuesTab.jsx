import React from "react";
import PropTypes from "prop-types";
import Workspace from "./Workspace";

const IssuesTab = props => {

  const { data } = props;

  return (
    <div className="flex overflow-auto gap-16 pt-6 px-8">
      {Object.entries(data).map(([name, data]) => (
        <Workspace key={name} name={name} data={data} />
      ))}
    </div>
  );
};

IssuesTab.propTypes = {
  data: PropTypes.object.isRequired,
};

export default IssuesTab;