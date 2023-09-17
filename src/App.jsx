import React, { useState } from "react";
import { useData } from "./hooks";
import Workspace from "./Workspace";
import Tabs from "./Tabs";
import IssuesTab from "./IssuesTab";
import ProjectsTab from "./ProjectsTab";

const App = () => {
  
  const data = useData();

  const [tab, setTab] = useState("projects");

  if (!data) return <div/>

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