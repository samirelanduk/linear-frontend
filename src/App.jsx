import React from "react";

const App = () => {

  const getTokens = () => {
    const workspaceNumbers = [];
    const pattern = /^VITE_WORKSPACE[0-9]+/;
    for (const key in import.meta.env) {
      if (pattern.test(key)) {
        const number = key.match(/[0-9]+/)[0];
        if (!workspaceNumbers.includes(number)) workspaceNumbers.push(number);
      }
    }
    workspaceNumbers.sort((a, b) => a - b);
    return workspaceNumbers.map(number => {
      return {
        name: import.meta.env[`VITE_WORKSPACE${number}_NAME`] || `Workspace ${number}`,
        token: import.meta.env[`VITE_WORKSPACE${number}_TOKEN`],
      };
    });
  }

  const tokens = getTokens();

  return (
    <div>
      {JSON.stringify(tokens)}
    </div>
  );
};

App.propTypes = {
  
};

export default App;