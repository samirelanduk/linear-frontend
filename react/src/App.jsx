import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import { getOrganization, initializeData } from "./fetch";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataContext } from "./contexts";
import HomePage from "./pages/HomePage";

const App = () => {

  const [data, setData] = useState(null);

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
};

App.propTypes = {
  
};

export default App;