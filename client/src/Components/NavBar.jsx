import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

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
        <nav className="bg-[#0d6fa3] text-white flex flex-col md:flex-row justify-around py-6 items-center gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">UNO</h3>
                <button className="block md:hidden absolute top-0 right-0 m-4" onClick={toggleMenu}>
                    {isOpen ? <AiOutlineClose size={24} /> : <GiHamburgerMenu size={24} />}
                </button>
            </div>

            <ul
                className={`flex ${
                    isOpen ? "flex-col h-screen" : "flex-row"
                } gap-4 justify-center ${isOpen ? "block" : "hidden md:flex"}`}
            >
                {!isLoading && (
                    <li className={isOpen ? "text-2xl" : ""}>
                        <NavLink to="/register">Register</NavLink>
                    </li>
                )}
                <li className={isOpen ? "text-2xl" : ""}>
                    <NavLink to="/rules">Rules</NavLink>
                </li>
                {isLoading && (
                    <>
                        <li className={isOpen ? "text-2xl" : ""}>
                            <NavLink to="/lobby">Lobby</NavLink>
                        </li>
                        <li className={isOpen ? "text-2xl" : ""}>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                        <li className={isOpen ? "text-2xl" : ""}>
                            <NavLink to="/players">Players</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};
export default NavBar;
