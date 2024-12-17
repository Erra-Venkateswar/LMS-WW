import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetLeaveRequestById, EditLeaveRequestById } from "../Services/LeaveActions";

function EditLeave() {
    const { id } = useParams();
    const [leaveDetails, setLeaveDetails] = useState({
        EmployeeName: "",
        EmployeePhone: "",
        ManagerName: "",
        FromDate: "",
        ToDate: "",
        TotalDays: "",
        ReasonForLeave: "",
        Status : ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [managerNameError, setManagerNameError] = useState("");
    const [fromDateError, setFromDateError] = useState("");
    const [toDateError, setToDateError] = useState("");
    const [reasonError, setReasonError] = useState("");

    const empId = useSelector(state => state.userId);

    const userName = useSelector(state => state.userName);

    const userPhone = useSelector(state => state.userPhone);

    const [data, setData] = useState([]);

    const [filteredManagers, setFilteredManagers] = useState([]);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const role = 'Manager';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return ""; // Return empty string if invalid date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Ensure 2 digits (month is 0-based)
        const day = String(date.getDate()).padStart(2, '0');  // Ensure 2 digits
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {

        const fetchLeaveDetails = async () => {

            try {

                const response = await GetLeaveRequestById(id);

                if (!response.ok) {
                    throw new Error("Failed to fetch leave details");
                }

                const data = await response.json();

                setLeaveDetails({
                    EmployeeName : data.employeeName,
                    EmployeePhone : data.employeePhone,
                    ManagerName : data.managerName,
                    FromDate : formatDate(data.fromDate),
                    ToDate : formatDate(data.toDate),
                    TotalDays : data.totalDays,
                    ReasonForLeave : data.reasonForLeave,
                    Status : data.status
                });

            } catch (error) {
                setError(error.message);
            }
        };

        fetchLeaveDetails();

    }, [id]);

    const handleChange = (event) => {
        setLeaveDetails((prevDetails) => ({
            ...prevDetails,
            [event.target.name]: event.target.value,
        }));
    };

    const isValidName = (name) => {
        const namePattern = /^[A-Za-z\s]+$/;
        return namePattern.test(name);
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setManagerNameError("");
        setFromDateError("");
        setToDateError("");
        setReasonError("");

        if (!leaveDetails.ManagerName || !leaveDetails.FromDate || !leaveDetails.ToDate || !leaveDetails.ReasonForLeave) {
            if (!leaveDetails.ManagerName) setManagerNameError("Manager Name is required.");
            if (!leaveDetails.FromDate) setFromDateError("From Date is required.");
            if (!leaveDetails.ToDate) setToDateError("To Date is required.");
            if (!leaveDetails.ReasonForLeave) setReasonError("Reason for Leave is required.");
            return;
        }

        if (!isValidName(leaveDetails.ManagerName)) {
            setManagerNameError("Manager Name can only contain letters and spaces.");
            return;
        }

        const fromDate = new Date(leaveDetails.FromDate);
        const toDate = new Date(leaveDetails.ToDate);

        if (fromDate > toDate) {
            setToDateError("From Date should be earlier than To Date.");
            return;
        }

        setManagerNameError("");
        setFromDateError("");
        setToDateError("");
        setReasonError("");

        const token = localStorage.getItem("jwt_token");

        if (!token) {
            setError("No token found. Please login again.");
            return;
        }

        const fd = new FormData(event.target);

        const leave = {
            LeaveId : id,
            EmployeeId : fd.get('EmployeeId'),
            EmployeeName: fd.get('EmployeeName'),
            EmployeePhone: fd.get('EmployeePhone'),
            ManagerName: fd.get('ManagerName'),
            FromDate: fd.get('FromDate'),
            ToDate: fd.get('ToDate'),
            TotalDays: fd.get('TotalDays'),
            ReasonForLeave: fd.get('ReasonForLeave'),
            Status : leaveDetails.Status
        };

        try {

            const response = await EditLeaveRequestById(id, leave);

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Error details:", errorDetails);
                throw new Error("Failed to update leave request");
            }

            navigate("/list");
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {

        const fetchUsersByRole = async () => {

            const response = await fetch('https://localhost:7281/api/Users/role/'+role);

            const resultData = await response.json();

            setData(resultData);

            setFilteredManagers(resultData);

            return resultData;
        }

        fetchUsersByRole();

    }, [role]);

    
    const calculateTotalDays = () => {
        const fromDate = new Date(leaveDetails.FromDate);
        const toDate = new Date(leaveDetails.ToDate);

        if (fromDate && toDate && fromDate <= toDate) {
            const timeDifference = toDate - fromDate;
            const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

            return totalDays + 1;
        }
        return 0; // Return 0 if invalid or no dates
    };

    const handleDateBlur = () => {
        const totalDays = calculateTotalDays();
        setLeaveDetails(prevValues => ({
            ...prevValues,
            TotalDays: totalDays
        }));
    };

    const handleManagerNameChange = (event) => {
        const query = event.target.value;
        setLeaveDetails({ ...leaveDetails, ManagerName: query });

        if (query) {
            setIsDropdownVisible(true); // Show dropdown when user starts typing
            const filtered = data.filter(user => 
                user.userName && user.userName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredManagers(filtered);
        } else {
            setIsDropdownVisible(false); // Hide dropdown if input is empty
        }
    };

    const handleManagerSelect = (managerName) => {
        setLeaveDetails({ ...leaveDetails, ManagerName: managerName });
        setIsDropdownVisible(false); // Hide dropdown after selection
    };

    useEffect(() => {
        document.title = "Edit Leave-LMS";
    }, []);

    return (
        <>
            <div className="leave-request-container">
                <div className="leave-request-form">
                    <h2 className="leave-request-header">Edit Leave Request</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group-leave">
                            <label htmlFor="EmployeeId">Employee ID</label>
                            <input
                            type="text"
                            id="EmployeeId"
                            name="EmployeeId"
                            value={empId}
                            onChange={(event) => handleChange(event)}
                            required
                            readOnly
                            />
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="EmployeeName">Employee Name</label>
                            <input
                            type="text"
                            id="EmployeeName"
                            name="EmployeeName"
                            value={userName}
                            onChange={(event) => handleChange(event)}
                            placeholder="Enter your name"
                            required
                            readOnly
                            />
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="EmployeePhone">Employee Phone</label>
                            <input
                            type="text"
                            id="EmployeePhone"
                            name="EmployeePhone"
                            value={userPhone}
                            onChange={(event) => handleChange(event)}
                            placeholder="Enter your phone number"
                            required
                            readOnly
                            />
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="ManagerName">Manager Name</label>
                            <input
                                type="text"
                                id="ManagerName"
                                name="ManagerName"
                                value={leaveDetails.ManagerName}
                                onChange={handleManagerNameChange}
                                placeholder="Start typing manager's name"
                            />
                            {managerNameError && <p className="error-message-leave">{managerNameError}</p>}
                            {isDropdownVisible && (
                            <ul className="manager-dropdown">
                                {filteredManagers.map((user, index) => (
                                    <li key={index} onClick={() => handleManagerSelect(user.userName)}>
                                        {user.userName}
                                    </li>
                                ))}
                            </ul>
                            )}
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="FromDate">From Date</label>
                            <input
                            type="date"
                            id="FromDate"
                            name="FromDate"
                            value={leaveDetails.FromDate}
                            onChange={(event) => handleChange(event)}
                            />
                            {fromDateError && <p className="error-message-leave">{fromDateError}</p>}
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="ToDate">To Date</label>
                            <input
                            type="date"
                            id="ToDate"
                            name="ToDate"
                            value={leaveDetails.ToDate}
                            onChange={(event) => handleChange(event)}
                            onBlur={handleDateBlur}
                            />
                            {toDateError && <p className="error-message-leave">{toDateError}</p>}
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="TotalDays">Total Days</label>
                            <input
                            type="number"
                            id="TotalDays"
                            name="TotalDays"
                            value={leaveDetails.TotalDays}
                            onChange={(event) => handleChange(event)}
                            placeholder="Enter total days"
                            readOnly
                            />
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="ReasonForLeave">Reason for Leave</label>
                            <textarea
                            id="ReasonForLeave"
                            name="ReasonForLeave"
                            value={leaveDetails.ReasonForLeave}
                            onChange={(event) => handleChange(event)}
                            placeholder="Enter reason for leave"
                            />
                            {reasonError && <p className="error-message-leave">{reasonError}</p>}
                        </div>

                        {error && <p className="error-message-leave">{error}</p>}
          
                        <button type="submit" className="submit-button-leave">Edit Leave Request</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditLeave;
