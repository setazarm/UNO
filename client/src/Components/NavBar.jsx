import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

const NavBar = ({ isLoading, setIsloading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}, [isOpen]);
  const closeMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsloading(true);
    } else {
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    navigate(closeMenu);
  }, [navigate, closeMenu]);

  return (
    <motion.nav
      className="bg-[#0d6fa3] text-white flex flex-col md:flex-row justify-around py-6 items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <motion.h3
          onClick={() => {
            navigate("/lobby");
          }}
          className="text-4xl font-bungee font-bold animate-text bg-gradient-to-r from-green-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120  }}
        >
          UNO
        </motion.h3>
        <motion.button
          className="block md:hidden absolute top-3 right-4 m-4 border-gray-200 border-2 p-1 rounded-full"
          onClick={toggleMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isOpen ? <AiOutlineClose size={24} /> : <GiHamburgerMenu size={24} />}
        </motion.button>
      </div>

      <motion.ul
        className={`flex ${
          isOpen ? "flex-col h-screen" : "flex-row"
        } gap-4 text-xl font-bungee justify-center ${isOpen ? "block" : "hidden md:flex"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!isLoading && (
          <motion.li
            className={isOpen ? "text-3xl" : ""}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <NavLink className='hover:text-300-red' to="/register">Register</NavLink>
          </motion.li>
        )}
        <motion.li
          className={isOpen ? "text-3xl" : ""}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={
            ()=> {setIsOpen(false)}
          }
        >
          <NavLink className='hover:text-gray-300 '  to="/rules">Rules</NavLink>
        </motion.li>
        {isLoading && (
          <>
            <motion.li
              className={isOpen ? "text-3xl" : ""}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={
                ()=> {setIsOpen(false)}
              }
            >
              <NavLink className='hover:text-gray-300 '  to="/lobby">Lobby</NavLink>
            </motion.li>
            <motion.li
              className={isOpen ? "text-3xl" : ""}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={
                ()=> {setIsOpen(false)}
              }
            >
              <NavLink className='hover:text-gray-300 '  to="/profile">Profile</NavLink>
            </motion.li>
            <motion.li
              className={isOpen ? "text-3xl" : ""}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={
                ()=> {setIsOpen(false)}
              }
            >
              <NavLink className='hover:text-gray-300 '  to="/players">Players</NavLink>
            </motion.li>
          </>
        )}
      </motion.ul>
    </motion.nav>
  );
};

export default NavBar;
