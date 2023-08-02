import React from "react";
import { useData } from "./hooks";

const App = () => {

  const data = useData();

  return (
    <div className="flex">
      {Object.entries(data).map(([name, issues]) => (
        <div key={name} className="">
          <div>{name}</div>
          <div className="flex flex-col">
            {issues.map((issue) => (
              <div key={issue.id} className="flex">
                <div>{issue.title}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;