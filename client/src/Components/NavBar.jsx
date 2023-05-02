import { NavLink } from "react-router-dom";

const NavBar = () => {
    // Still need to conditionally show different thing
    // If user is not logged in show only logo, register, rules
    // If user is logged in hide register and show the rest
    return (
        <nav>
            <ul>
                <li>
                    <h3>UNO</h3>
                </li>
                <li>
                    <NavLink to="/register">Register</NavLink>
                </li>
                <li>
                    <NavLink to="/rules">Rules</NavLink>
                </li>
                <li>
                    <NavLink to="/lobby">Lobby</NavLink>
                </li>
                <li>
                    <NavLink to="/profile">Profile</NavLink>
                </li>
            </ul>
        </nav>
    );
};
export default NavBar;
