import { useContext } from "react";
import Organization from "../components/Organization";
import { DataContext } from "../contexts";

const HomePage = () => {

  const [data,] = useContext(DataContext);

  return (
    <main className="flex flex-col gap-14 pb-8 bg-slate-700 text-white min-h-svh">
      {Object.entries(data).map(([name, organization]) => (
        <Organization key={name} name={name} organization={organization} />
      ))}
    </main>
  );
};

HomePage.propTypes = {
  
};

export default HomePage;