import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NewUserPage() {
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [values, setValues] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        role: '',
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    function handleValues(event) {
        const { name, value } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    }

    async function checkEmailOrPhone() {

        const response = await fetch('https://localhost:7281/api/Users/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                phone: values.phone,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.emailExists) {
                setEmailError("Email is already in use");
            } else {
                setEmailError(""); // Clear email error if valid
            }

            if (data.phoneExists) {
                setPhoneError("Phone number is already in use");
            } else {
                setPhoneError(""); // Clear phone error if valid
            }

            // Return true if no errors
            return !data.emailExists && !data.phoneExists;
        } else {
            setError("Error checking email/phone");
            return false;
        }
    }

    async function handleSubmit(event) {

        event.preventDefault();

        const isValid = await checkEmailOrPhone();
        if (!isValid) {
            return;
        }

        setIsLoading(true);

        const fd = new FormData(event.target);

        const employee = {
            Username: fd.get('username'),
            Email: fd.get('email'),
            Phone: fd.get('phone'),
            Password: fd.get('password'),
            Role: fd.get('role'),
        };

        const token = localStorage.getItem('jwt_token');

        const response = await fetch('https://localhost:7281/api/Users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });

        if (!response.ok) {
            setError("Failed to send data");
        } else {
            navigate('/userList');
        }

        setIsLoading(false);
    }

    useEffect(() => {
        document.title = "Add New User-LMS";
    }, []);

    return (
        <div className="registration-container">
            <div className="registration-form">
                <h2 className="form-header">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={values.username}
                            onChange={handleValues}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={values.email}
                            onChange={handleValues}
                            required
                            placeholder="Enter your email"
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={values.phone}
                            onChange={handleValues}
                            required
                            placeholder="Enter your phone number"
                        />
                        {phoneError && <p className="error-message">{phoneError}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleValues}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="select-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={values.role}
                            onChange={handleValues}
                            required
                        >
                            <option value="">--Select Role--</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-button">{isLoading ? 'Please wait...' : 'Register'}</button>
                </form>
            </div>
        </div>
    );
}

export default NewUserPage;