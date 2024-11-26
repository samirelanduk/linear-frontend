import { Link, useLocation } from "react-router-dom";

const Nav = () => {

  const path = useLocation().pathname;

  const navLinkClass = "h-9 flex items-center px-3 rounded-md font-medium text-lg";
  const navLinkActiveClass = `${navLinkClass} bg-slate-100 text-sky-800`;
  const navLinkInactiveClass = `${navLinkClass} hover:bg-slate-600`;

  return (
    <nav className="h-20 text-white">
      <div className="flex h-full px-10 gap-4 items-center">
        <Link to="/" className={path === "/" ? navLinkActiveClass : navLinkInactiveClass}>Teams</Link>
        <Link to="/projects" className={path === "/projects" ? navLinkActiveClass : navLinkInactiveClass}>Projects</Link>
        <Link to="/due" className={path === "/due" ? navLinkActiveClass : navLinkInactiveClass}>Due</Link>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;