const token = localStorage.getItem("jwt_token");

export const GetLeaveRequestById = async (id) => {

    if (!token) {
        const error = "No token found. Please login again.";
        return error;
    }
        
    const response = await fetch(`https://localhost:7281/api/LeaveRequest/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    return response;
}

export const EditLeaveRequestById = async (id, leave) => {

    const response = await fetch(`https://localhost:7281/api/LeaveRequest/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(leave),
    });

    return response;
}

export const PostLeaveRequest = async (leave) => {
    const response = await fetch('https://localhost:7281/api/LeaveRequest/ApplyLeave', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify(leave)
    });

    return response;
}

export const DeleteLeaveRequest = async (id) => {
    const response = await fetch(`https://localhost:7281/api/LeaveRequest/${id}`,
    {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${token}`,
        },
    });

    return response;
}

export const GetAllLeaves = async(id) => {
    const response = await fetch(`https://localhost:7281/api/LeaveRequest/employee/${id}`,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization' : `Bearer ${token}`,
        },
    });

    return response;
}

export const LoginUser = async(user) => {
    const response = await fetch('https://localhost:7281/api/Users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    return response;
}