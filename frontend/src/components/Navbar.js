import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Button } from "flowbite-react";

export const NavbarAb = () => {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/account", label: "Account" },
    { to: "/problems", label: "Problems" },
    { to: "/fqa", label: "FQA" },
    { to: "/submissions", label: "Submissions" },
    { to: "/rankings", label: "Rankings" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img
            src="https://cdn-icons-png.flaticon.com/128/2103/2103658.png"
            className="mr-3 h-6 sm:h-9"
          alt="Innoxus"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Abstracx
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button className="mr-2">API</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="justify-center">
        {navLinks.map((link) => (
          <Navbar.Link
            key={link.to}
            as={Link}
            to={link.to}
            active={location.pathname === link.to}
          >
            {link.label}
          </Navbar.Link>
        ))}
        <Navbar.Link
          as="div"
          className={`relative ${isOpen ? 'show' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          Admin
          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <Link to="/admin/setting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Administrador Settings</Link>
                <Link to="/admin/problem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Problems Settings</Link>
                <Link to="/admin/team" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Teams Settings</Link>
                <Link to="/admin/group" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Group Settings</Link>
              </div>
            </div>
          )}
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};