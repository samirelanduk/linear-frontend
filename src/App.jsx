import React from "react";
import { useData } from "./hooks";
import Workspace from "./Workspace";

const App = () => {
  
  const data = useData();

  if (!data) return <div/>

  return (
    <div className="flex overflow-auto gap-16 pt-6 px-8">
      {Object.entries(data).map(([name, data]) => (
        <Workspace key={name} name={name} data={data} />
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;