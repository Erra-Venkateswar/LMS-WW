import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PostLeaveRequest } from "../Services/LeaveActions";

function NewLeaveRequest() {

    const [formValues, setFormValues] = useState({
        EmployeeId : "",
        EmployeeName : "",
        EmployeePhone : "",
        ManagerName : "",
        FromDate : "",
        ToDate : "",
        TotalDays : "",
        ReasonForLeave : ""
    });

    const [data, setData] = useState([]);

    const [filteredManagers, setFilteredManagers] = useState([]);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const [managerNameError, setManagerNameError] = useState("");
    const [fromDateError, setFromDateError] = useState("");
    const [toDateError, setToDateError] = useState("");
    const [reasonError, setReasonError] = useState("");

    const userId = useSelector(state => state.userId);

    const userName = useSelector(state => state.userName);

    const userPhone = useSelector(state => state.userPhone);

    const navigate = useNavigate();

    const role = 'Manager';

    const status = 'Pending';

    function handleChange(event) {
        setFormValues({
            ...formValues,[event.target.name] : event.target.value
        });
    }

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

    const isValidName = (name) => {
        const namePattern = /^[A-Za-z\s]+$/;
        return namePattern.test(name);
    };

    async function handleSubmit(event) {

        event.preventDefault();

        setManagerNameError("");
        setFromDateError("");
        setToDateError("");
        setReasonError("");

        if (!formValues.ManagerName) setManagerNameError("Manager Name is required.");
        if (!formValues.FromDate) setFromDateError("From Date is required.");
        if (!formValues.ToDate) setToDateError("To Date is required.");
        if (!formValues.ReasonForLeave) setReasonError("Reason for Leave is required.");

        if (!formValues.ManagerName || !formValues.FromDate || !formValues.ToDate || !formValues.ReasonForLeave) {
            return;
        }

        if (!isValidName(formValues.ManagerName)) {
            setManagerNameError("Manager Name can only contain letters and spaces.");
            return;
        }

        const fromDate = new Date(formValues.FromDate);
        const toDate = new Date(formValues.ToDate);

        if (fromDate > toDate) {
            setToDateError("From Date should be earlier than To Date.");
            return;
        }

        setManagerNameError("");
        setFromDateError("");
        setToDateError("");
        setReasonError("");

        const fd = new FormData(event.target);

        const leave = {
            EmployeeId : fd.get('EmployeeId') || userId,
            EmployeeName: fd.get('EmployeeName') || userName,
            EmployeePhone: fd.get('EmployeePhone') || userPhone,
            ManagerName : fd.get('ManagerName'),
            FromDate : fd.get('FromDate'),
            ToDate : fd.get('ToDate'),
            TotalDays : fd.get('TotalDays'),
            ReasonForLeave : fd.get('ReasonForLeave'),
            Status : status
        };
        
        const response = await PostLeaveRequest(leave);

        if(!response.ok) {
            throw new Error("Failed to Fetch Data");
        }

        navigate('/list');
    }

    const calculateTotalDays = () => {
        const fromDate = new Date(formValues.FromDate);
        const toDate = new Date(formValues.ToDate);

        if (fromDate && toDate && fromDate <= toDate) {
            const timeDifference = toDate - fromDate;
            const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            return totalDays + 1;
        }
        return 0;
    };

    const handleDateBlur = () => {
        const totalDays = calculateTotalDays();
        setFormValues(prevValues => ({
            ...prevValues,
            TotalDays: totalDays
        }));
    };

    const handleManagerNameChange = (event) => {
        const query = event.target.value;
        setFormValues({ ...formValues, ManagerName: query });

        if (query) {
            setIsDropdownVisible(true);
            const filtered = data.filter(user => 
                user.userName && user.userName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredManagers(filtered);
        } else {
            setIsDropdownVisible(false);
        }
    };

    const handleManagerSelect = (managerName) => {
        setFormValues({ ...formValues, ManagerName: managerName });
        setIsDropdownVisible(false);
    };

    useEffect(() => {
        document.title = "New Leave Request-LMS";
    }, []);

    return (
        <>
            <div className="leave-request-container">
                <div className="leave-request-form">
                    <h2 className="leave-request-header">Leave Request Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group-leave">
                            <label htmlFor="EmployeeId">Employee ID</label>
                            <input
                            type="text"
                            id="EmployeeId"
                            name="EmployeeId"
                            value={formValues.EmployeeId || userId}
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
                            value={formValues.EmployeeName || userName}
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
                            value={formValues.EmployeePhone || userPhone}
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
                                value={formValues.ManagerName}
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
                            value={formValues.FromDate}
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
                            value={formValues.ToDate}
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
                            value={formValues.TotalDays}
                            onChange={(event) => handleChange(event)}
                            placeholder="Enter total days"
                            required
                            readOnly
                            />
                        </div>

                        <div className="input-group-leave">
                            <label htmlFor="ReasonForLeave">Reason for Leave</label>
                            <textarea
                            id="ReasonForLeave"
                            name="ReasonForLeave"
                            value={formValues.ReasonForLeave}
                            onChange={(event) => handleChange(event)}
                            placeholder="Enter reason for leave"
                            />
                            {reasonError && <p className="error-message-leave">{reasonError}</p>}
                        </div>
          
                        <button type="submit" className="submit-button-leave">Submit Leave Request</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default NewLeaveRequest;