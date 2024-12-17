import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditUserById } from "../Services/UserActions";

function EditUser() {

    const params = useParams();

    const [error, setError] = useState("");

    const [values, setValues] = useState({
        username : '',
        email : '',
        phone : '',
        password : '',
        role : '',
    });

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const userId = params.id;

    function handleValues(event) {
        const { name, value } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    }

    useEffect(() => {

        const fetchUserById = async () => {

            const response = await fetch('https://localhost:7281/api/Users/' + userId);

            const resultData = await response.json();

            setValues({
                username : resultData.userName,
                email : resultData.email,
                phone : resultData.phone,
                password : resultData.password,
                role : resultData.role
            });

            return resultData;
        }

        fetchUserById();

    }, [userId]);

    //console.log('state:',values);

    async function handleSubmit(event) {
        
        event.preventDefault();

        setIsLoading(true);

        const token = localStorage.getItem('jwt_token');

        if(!token) {
            setError('Token not found');
        }

        const fd = new FormData(event.target);

        const user = {
            UserId : fd.get('userId'),
            Username : fd.get('username'),
            Email : fd.get('email'),
            Phone : fd.get('phone'),
            Password : fd.get('password'),
            Role : fd.get('role'),
        }

        //console.log(user);

        try {

            const response = await EditUserById(userId, user);
            
            if(!response.ok) {
                setError("Failed to edit the user, Please try again");
            }

            navigate('/userList');

            setIsLoading(false);
        }
        catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        document.title = "Edit User-LMS";
    }, []);

    return (
        <div className="registration-container">
            <div className="registration-form">
                <h2 className="form-header">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="userId">User ID</label>
                        <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={userId}
                        required
                        placeholder="Enter your userId"
                        readOnly
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        value={values.username}
                        onChange={(event) => handleValues(event)}
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
                        onChange={(event) => handleValues(event)}
                        required
                        placeholder="Enter your email"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={(event) => handleValues(event)}
                        required
                        placeholder="Enter your phone number"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={(event) => handleValues(event)}
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
                        onChange={(event) => handleValues(event)}
                        required
                        >
                            <option value="">--Select Role--</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-button">{isLoading ? 'Please wait...' : 'Edit'}</button>
                </form>
            </div>
        </div>
    );
}

export default EditUser;