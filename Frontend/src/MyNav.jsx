import { NavLink } from "react-router";

export default function MyNav() {
    return (
        <nav>
            <NavLink to ="/" end>
                Home
            </NavLink>
            <NavLink to="/Dashboard" end>
                Dashboard
            </NavLink>
        </nav>
    )
}