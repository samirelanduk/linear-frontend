import { useEffect, useState } from "react";
import Organization from "./components/Organization";
import StatesToggle from "./components/StatesToggle";
import { ClipLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import { getOrganization, initializeData } from "./fetch";

const App = () => {

  const [data, setData] = useState(null);

  const [states, setStates] = useState(["unstarted", "started"]);

  useEffect(() => {
    (async () => {
      const organizations = await initializeData(setData);
      for (const organization of organizations) {
        await getOrganization(organization, setData);
      }
    })();
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center bg-slate-700 text-white min-h-svh">
        <ClipLoader color={colors.slate[400]} size={200} cssOverride={{"borderWidth": "20px"}} speedMultiplier={1.25} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 py-8 bg-slate-700 text-white min-h-svh">
      <StatesToggle states={states} setStates={setStates} className="fixed right-10" />
      {Object.entries(data).map(([name, organization]) => (
        <Organization key={name} name={name} organization={organization} states={states} />
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;