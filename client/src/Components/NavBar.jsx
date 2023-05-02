import { NavLink } from "react-router-dom";

const NavBar = () => {
    // Still need to conditionally show different thing
    // If user is not logged in show only logo, register, rules
    // If user is logged in hide register and show the rest
    const user = localStorage.getItem("token");
    return (
        <nav>
            <ul className="flex flex-row gap-4 justify-center">
                <li>
                    <h3>UNO</h3>
                </li>
                {!user && (
                    <li>
                        <NavLink to="/register">Register</NavLink>
                    </li>
                )}
                <li>
                    <NavLink to="/rules">Rules</NavLink>
                </li>
                {user && (
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
