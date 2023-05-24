import { Link } from "react-router-dom";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";

const Footer = () => {
    return (
        <footer className="bg-[#0d6fa3] py-4 mt-auto">
            <nav className="container mx-auto px-4">
                <ul className="flex justify-between">
                    <li className="mr-6">
                        <Link to="/imprint" className="text-white hover:text-gray-400">
                            Imprint
                        </Link>
                    </li>
                    <li className="mr-6 ml-auto">
                        <a
                            href="https://twitter.com/realUNOgame"
                            className="text-white hover:text-gray-400 text-3xl"
                        >
                            {<AiFillTwitterCircle />}
                        </a>
                    </li>
                    <li className="mr-6">
                        <a
                            href="https://www.instagram.com/uno/?hl=en"
                            className="text-white hover:text-gray-400 text-3xl"
                        >
                            {<AiFillInstagram />}
                        </a>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Footer;
