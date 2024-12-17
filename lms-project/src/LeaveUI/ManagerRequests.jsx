import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
//import { Link } from "react-router-dom";

function ManagerRequestsPage() {

    const [data, setData] = useState([]);

    const [error, setError] = useState(null);

    const userName = useSelector(state => state.userName);

    useEffect(() => {

        if(!userName) {
            return;
        }
        
        const fetchLeaves = async () => {

            setError(null);

            const token = localStorage.getItem('jwt_token');
            if (!token) {
                setError("No token found. Please login again.");
                return;
            }

            try {
    
                const response = await fetch('https://localhost:7281/api/LeaveRequest/manager/'+userName, {
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const resultData = await response.json();

                setData(resultData);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchLeaves();

    }, [userName]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const handleApprove = async (leaveId) => {

        const token = localStorage.getItem('jwt_token');

        if (!token) {
            setError("No token found. Please login again.");
            return;
        }

        try {

            const leaveToApprove = data.find(leave => leave.leaveId === leaveId);

            const updatedLeave = {
                ...leaveToApprove,
                status: 'Approved'
            };

            const response = await fetch(`https://localhost:7281/api/LeaveRequest/${leaveId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedLeave)
            });

            if (!response.ok) {
                throw new Error("Failed to approve the leave request");
            }

            // Update the state to reflect the approved leave in the UI
            setData((prevData) =>
                prevData.map((leave) =>
                    leave.leaveId === leaveId ? { ...leave, status: 'Approved' } : leave
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleReject = async (leaveId) => {

        const token = localStorage.getItem('jwt_token');

        if (!token) {
            setError("No token found. Please login again.");
            return;
        }

        try {

            const leaveToApprove = data.find(leave => leave.leaveId === leaveId);

            const updatedLeave = {
                ...leaveToApprove,
                status: 'Rejected'
            };

            const response = await fetch(`https://localhost:7281/api/LeaveRequest/${leaveId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedLeave)
            });

            if (!response.ok) {
                throw new Error("Failed to approve the leave request");
            }

            // Update the state to reflect the approved leave in the UI
            setData((prevData) =>
                prevData.map((leave) =>
                    leave.leaveId === leaveId ? { ...leave, status: 'Rejected' } : leave
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const columns = [
        {
          name: "Employee ID",
          selector: row => row.employeeId,
          sortable: true
        },
        {
          name: "Employee Name",
          selector: row => row.employeeName,
          sortable: true
        },
        {
          name: "From",
          selector: row => formatDate(row.fromDate),
          sortable: true
        },
        {
          name: "To",
          selector: row => formatDate(row.toDate),
          sortable: true
        },
        {
          name: "Total Days",
          selector: row => row.totalDays,
          sortable: true
        },
        {
            name: "Reason For Leave",
            selector: row => row.reasonForLeave,
            sortable: true
        },
        {
          name: "Actions",
          cell: row => (
            row.status === 'Approved' ? (
                <span
                    className={`status-badge ${
                        row.status.toLowerCase() === 'approved'
                        ? 'status-approved'
                        : row.status.toLowerCase() === 'rejected'
                        ? 'status-rejected'
                        : 'status-pending'
                    }`}
                >
                    Approved
                </span>
                ) : row.status === 'Rejected' ? (
                <span
                    className={`status-badge ${
                      row.status.toLowerCase() === 'approved'
                        ? 'status-approved'
                        : row.status.toLowerCase() === 'rejected'
                        ? 'status-rejected'
                        : 'status-pending'
                    }`}
                >
                    Rejected
                </span>
                ) : (
                <>
                    <div className="manager-actions">
                        <button className="edit" onClick={() => handleApprove(row.leaveId)}>
                            Approve
                        </button>
                        <button className="cancel" onClick={() => handleReject(row.leaveId)}>
                            Reject
                        </button>
                    </div>
                </>
            )
          ),
        }
    ];

    useEffect(() => {
        document.title = "Manager Dashboard-LMS";
    }, []);

    return(
        <>
        <h1>List of Leaves</h1>
        <div className="app">
            {/* <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search leaves..." 
                    className="search-input" 
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div> */}

            {error ? (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
            <DataTable columns={columns} data={data} highlightOnHover pointerOnHover responsive/>
            )}
        </div>
    </>
    );
}

export default ManagerRequestsPage;