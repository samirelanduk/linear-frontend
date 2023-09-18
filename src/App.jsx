import React, { useState } from "react";
import { useData } from "./hooks";
import Workspace from "./Workspace";
import Tabs from "./Tabs";
import IssuesTab from "./IssuesTab";
import ProjectsTab from "./ProjectsTab";
import { ClipLoader } from "react-spinners";

const App = () => {
  
  const data = useData();

  const [tab, setTab] = useState("projects");

  if (Object.keys(data).length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={200} speedMultiplier={2} />
      </div>
    );
  }

  return (
    <div>
      <Tabs activeTab={tab} setActiveTab={setTab} />
      {tab === "issues" && <IssuesTab data={data} />}
      {tab === "projects" && <ProjectsTab data={data} />}
    </div>
  );
};

App.propTypes = {
  
};

export default App;