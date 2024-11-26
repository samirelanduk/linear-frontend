import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import { getOrganization, initializeData } from "./fetch";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import { DataContext, StatesContext } from "./contexts";
import HomePage from "./pages/HomePage";
import DuePage from "./pages/DuePage";

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
    <DataContext.Provider value={[data, setData]}>
      <StatesContext.Provider value={[states, setStates]}>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/due" element={<DuePage />} />
          </Routes>
        </BrowserRouter>
      </StatesContext.Provider>
    </DataContext.Provider>
  );
};

App.propTypes = {
  
};

export default App;