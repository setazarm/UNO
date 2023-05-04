import { NavLink } from "react-router-dom";
import { useEffect } from "react";

const NavBar = ({
    isLoading,
    setIsloading
}) => {
    
    useEffect(()=> {
        const token = localStorage.getItem("token");
        if (token) {
            setIsloading(true);
        } else {
            setIsloading(false);
        }
    },[])


  

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
