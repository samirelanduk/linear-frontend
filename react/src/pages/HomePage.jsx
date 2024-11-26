import { useContext, useState } from "react";
import Organization from "../components/Organization";
import StatesToggle from "../components/StatesToggle";
import { DataContext } from "../contexts";

const HomePage = () => {

  const [states, setStates] = useState(["unstarted", "started"]);
  const [data,] = useContext(DataContext);

  return (
    <div className="flex flex-col gap-10 py-8 bg-slate-700 text-white min-h-svh">
      <StatesToggle states={states} setStates={setStates} className="fixed right-10" />
      {Object.entries(data).map(([name, organization]) => (
        <Organization key={name} name={name} organization={organization} states={states} />
      ))}
    </div>
  );
};

HomePage.propTypes = {
  
};

export default HomePage;