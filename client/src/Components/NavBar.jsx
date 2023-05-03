import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
const NavBar = ({
    isLoading,
    setIsloading
}) => {
    // Still need to conditionally show different thing
    // If user is not logged in show only logo, register, rules
    // If user is logged in hide register and show the rest
    
  
  

    return (
        <nav>
            <ul className="flex flex-row gap-4 justify-center">
                <li>
                    <h3>UNO</h3>
                </li>
                {!isLoading && (
                    <li>
                        <NavLink to="/register">Register</NavLink>
                    </li>
                )}
                <li>
                    <NavLink to="/rules">Rules</NavLink>
                </li>
                {isLoading && (
                    <>
                        <li>
                            <NavLink to="/lobby">Lobby</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};
export default NavBar;
