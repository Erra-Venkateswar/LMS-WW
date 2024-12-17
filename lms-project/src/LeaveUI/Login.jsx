import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/index.js";
import { useDispatch } from "react-redux";
import { LoginUser } from "../Services/LeaveActions.js";

function LoginPage() {

    const [error, setError] = useState("");

    const [values, setValues] = useState({
        email : "",
        Password : "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    function handleValues(event) {
        setValues({
            ...values, [event.target.name] : event.target.value
        });
    }

    async function fetchUserByEmail(email) {

        const response = await fetch('https://localhost:7281/api/Users/email/' + email);

        if (!response.ok) {
            throw new Error("User not found or server error");
        }

        const resultData = await response.json();

        dispatch(loginActions.setIsLogin());
        dispatch(loginActions.setRole(resultData.role));
        dispatch(loginActions.setProfileName(resultData.userName));
        dispatch(loginActions.setEmail(resultData.email));
        dispatch(loginActions.setUserId(resultData.userId));
        dispatch(loginActions.setUserPhone(resultData.phone));

        localStorage.setItem('userName', resultData.userName);
        localStorage.setItem('role', resultData.role);
        localStorage.setItem('email', resultData.email);
        localStorage.setItem('userId', resultData.userId);
        localStorage.setItem('userPhone', resultData.phone);

        return resultData;
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setIsLoading(true);

        const fd = new FormData(event.target);

        const user = {
            email: fd.get('email'),
            password: fd.get('Password'),
        };

        try {

            await fetchUserByEmail(user.email);

            const response = await LoginUser(user);

            if (!response.ok) {
                throw new Error("Invalid credentials or server error");
            }

            const data = await response.json();

            const token = data.token;

            localStorage.setItem("jwt_token", token);

            navigate('/list');

            setIsLoading(false);

        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        document.title = "Login-LMS";
    }, []);

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-header">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">User Email</label>
                        <input
                        type="text"
                        id="username"
                        name="email"
                        value={values.email}
                        onChange={(event) => handleValues(event)}
                        required
                        placeholder="Enter your User Email"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        name="Password"
                        value={values.Password}
                        onChange={(event) => handleValues(event)}
                        required
                        placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">{isLoading ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;