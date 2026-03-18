import { Link } from "react-router-dom";
import Switch from "../switch";
import logo from "../../assets/logo.png"
export const Navbar = () => (
    <nav className="flex w-full pl-20 pr-20 justify-center gap-32 items-center border-b border-gray-200 py-4">
        <Link to="/" className="font-bold text-2xl"><img src={logo} alt="" style={{ width: "100px", height: "50px" }} /></Link>
        <div className="flex gap-4 items-center justify-center">
            <Link to="/how-it-works" className="font-serif text-[#797979] hover:text-[#1a1a1a] transition-colors text-xl">How it works</Link>
            <Link to="/who-we-are" className="font-serif text-[#797979] hover:text-[#1a1a1a] transition-colors text-xl">Who we are</Link>
            <Link to="/contact-us" className="font-serif text-[#797979] hover:text-[#1a1a1a] transition-colors text-xl">Contact us</Link>
        </div>
        <div className="flex gap-4 items-center justify-center">
            <Switch />
        </div>
    </nav>
);