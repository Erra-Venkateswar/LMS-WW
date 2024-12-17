import { useState } from "react";

function FormElement({title, onSubmitting, values, userId, userName, userPhone, managerNameError, managerData, fromDateError, toDateError, reasonError}) {

    const[formValues, setFormValues] = useState(values);

    const [filteredManagers, setFilteredManagers] = useState([]);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleManagerNameChange = (event) => {

        const query = event.target.value;

        setFormValues({ ...formValues, ManagerName: query });

        if (query) {
            setIsDropdownVisible(true);
            const filtered = managerData.filter(user => 
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

    function handleChange(event) {
        setFormValues({
            ...formValues,[event.target.name] : event.target.value
        });
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

    return (
        <div className="leave-request-container">
            <div className="leave-request-form">
                <h2 className="leave-request-header">{title}</h2>
                <form onSubmit={onSubmitting}>
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
    );
}

export default FormElement;
