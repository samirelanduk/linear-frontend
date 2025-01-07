import { Link, useLocation } from "react-router-dom";
import StatesToggle from "./StatesToggle";

const Nav = () => {

  const path = useLocation().pathname;

  const navLinkClass = "h-9 flex items-center px-3 rounded-md font-medium text-sm px-2 h-7 sm:px-2.5 sm:text-base sm:h-8 md:px-3 md:text-lg md:h-9";
  const navLinkActiveClass = `${navLinkClass} bg-slate-100 text-sky-800`;
  const navLinkInactiveClass = `${navLinkClass} hover:bg-slate-600`;

  return (
    <nav className="h-20 text-white px-10 flex justify-between items-center fixed bg-slate-700 left-0 right-0 z-50">
      <div className="flex h-full gap-2 items-center sm:gap-3 md:gap-4">
        <Link to="/" className={path === "/" ? navLinkActiveClass : navLinkInactiveClass}>Teams</Link>
        <Link to="/due" className={path === "/due" ? navLinkActiveClass : navLinkInactiveClass}>Due</Link>
      </div>
      <StatesToggle />
    </nav>
  );
};

Nav.propTypes = {

};

export default Nav;