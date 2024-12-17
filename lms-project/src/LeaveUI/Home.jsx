import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function HomePage() {

    const isLoggedIn = useSelector(state => state.isLoggedIn);

    useEffect(() => {
        document.title = "Home-LMS";
    }, []);

    return (
        <div className="home">
            <h1>Welcome to your LMS</h1>
            {isLoggedIn ? <p>Please continue with your tasks</p>  : <p>Please <Link to="/login">Login</Link> to View your data</p>}
        </div>
    );
}

export default HomePage;