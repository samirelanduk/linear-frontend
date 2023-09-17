import React from "react";
import PropTypes from "prop-types";

const Tabs = props => {

  const { activeTab, setActiveTab } = props;

  const tabClass = "cursor-pointer px-4 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100";
  const activeTabClass = `${tabClass} bg-white`;
  const inactiveTabClass = `${tabClass}`;

  return (
    <div className="flex gap-2 ml-8 mt-4 bg-gray-300 w-fit p-1 rounded-md">
      <div 
        className={activeTab === "issues" ? activeTabClass : inactiveTabClass}
        onClick={() => setActiveTab("issues")}
      >
        Issues
      </div>
      <div 
        className={activeTab === "projects" ? activeTabClass : inactiveTabClass}
        onClick={() => setActiveTab("projects")}
      >
        Projects
      </div>
    </div>
  );
};

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Tabs;