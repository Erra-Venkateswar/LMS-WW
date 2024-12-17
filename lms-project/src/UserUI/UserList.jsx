import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import { DeleteUser } from "../Services/UserActions";

function UserList() {

    const [data, setData] = useState([]);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const response = await fetch('https://localhost:7281/api/Users');

                const resultData = await response.json();

                const filteredData = resultData.filter(user => user.userId !== 1 && user.role !== 'Admin');

                setData(filteredData);

                return resultData;
            }
            catch(error) {
                setError("Failed to fetch Data");
            }
        }

        fetchData();

    }, [data]);

    const columns = [
        {
            name : "User ID",
            selector : row => row.userId,
            sortable : true
        },
        {
            name : "User Name",
            selector : row => row.userName,
            sortable : true
        },
        {
            name : "User Email",
            selector : row => row.email,
            sortable : true
        },
        {
            name : "User Role",
            selector : row => row.role,
            sortable : true
        },
        {
            name : "Actions",
            cell : row => (
                <div className="button-container">
                    <button className="edit">
                    <Link to={`/editUser/${row.userId}`}>Edit</Link>
                    </button>
                    <button className="cancel" onClick={() => openDeleteModal(row.userId)}>
                        Delete
                    </button>
                </div>
            )
        }
    ];

    const openDeleteModal = (userId) => {
        setUserIdToDelete(userId);
        setShowModal(true);
        document.body.classList.add("modal-open");
    };
    
    const closeDeleteModal = () => {
        setShowModal(false);
        document.body.classList.remove("modal-open");
    };

    async function handleDelete(userId) {
        
        const token = localStorage.getItem('jwt_token');

        if (!token) {
            setError("No token found. Please login again.");
            return;
        }

        try {

            const response = await DeleteUser(userId);

            if(!response.ok) {
                setError('Cant delete the user, Please try again');
            }

            setData(data.filter(user => user.userId !== userId));

            setShowModal(false);

        }
        catch(error) {
            setError(error.messagge);
        }
    }

    useEffect(() => {
        document.title = "Admin Dashboard-LMS";
    }, []);

    return (
        <>
            <h1>List of Users</h1>
            <div className="app">
                {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                ) : data.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No Leave requests found for the given ID</p>
                ) : (
                <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                pointerOnHover
                responsive
                />
                )}
            </div>
            <DeleteModal
            isOpen={showModal}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
            leaveId={userIdToDelete}
            title= {'User'}
            />
        </>
    );
}

export default UserList;