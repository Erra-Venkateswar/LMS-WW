import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from '../Assets/WWlogo.png';
import { useDispatch, useSelector } from 'react-redux';
import { loginActions } from "../store/index.js";
import { useEffect } from "react";

function RootLayout() {

    const role = useSelector(state => state.role);

    const userName = useSelector(state => state.userName);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const isLoggedIn = useSelector(state => state.isLoggedIn);

    useEffect(() => {
        
        const token = localStorage.getItem('jwt_token');

        if (token) {

          const userName = localStorage.getItem('userName');
          const role = localStorage.getItem('role');
          const email = localStorage.getItem('email');
          const userId = localStorage.getItem('userId');
          const userPhone = localStorage.getItem('userPhone');
          
          dispatch(loginActions.setIsLogin());
          dispatch(loginActions.setRole(role));
          dispatch(loginActions.setProfileName(userName));
          dispatch(loginActions.setEmail(email));
          dispatch(loginActions.setUserId(userId));
          dispatch(loginActions.setUserPhone(userPhone));

        }
      }, [dispatch]);

    function handleLogoutClick() {

        localStorage.removeItem('jwt_token');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('userPhone');

        dispatch(loginActions.setIsLogin());

        dispatch(loginActions.setRole(''));

        dispatch(loginActions.setProfileName(''));

        dispatch(loginActions.setEmail(''));

        dispatch(loginActions.setUserId(''));

        dispatch(loginActions.setUserPhone(''));

        navigate('/login');
    }

    return (
        <>
        <header>
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image"/>
                    <span className="logo-text">Leave Management</span>
                </div>
                {isLoggedIn && (
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/addLeave">Leave Request Form</Link></li>
                        <li><Link to="/list">List of Leaves</Link></li>
                        {role === 'Manager' && (<li><Link to="/requests">View the Requests</Link></li>)}
                        {role === 'Admin' && (<li><Link to="/userList">List of Users</Link></li>)}
                    </ul>
                )}
                <div className="auth-section">
                    {isLoggedIn && userName && (<span className="welcome-text">Welcome, {userName}</span>)}
                    {isLoggedIn && role === 'Admin' && (<button className="auth-button"><Link to="/addUser">Add Employee</Link></button>)}
                    {isLoggedIn ? <button className="auth-button" onClick={handleLogoutClick}>Logout</button> : <button className="auth-button"><Link to="/login">Login</Link></button>}
                </div>
            </nav>
        </header>
        <Outlet/>
        </>
    );
}

export default RootLayout;