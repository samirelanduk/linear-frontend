import React, { useState } from "react";
import { useData } from "./hooks";
import Workspace from "./Workspace";
import Tabs from "./Tabs";
import IssuesTab from "./IssuesTab";

const App = () => {
  
  const data = useData();

  const [tab, setTab] = useState("issues");

  if (!data) return <div/>

  return (
    <div>
      <Tabs activeTab={tab} setActiveTab={setTab} />
      {tab === "issues" && <IssuesTab data={data} />}
    </div>
  );
};

App.propTypes = {
  
};

export default App;