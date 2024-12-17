const token = localStorage.getItem('jwt_token');

export const EditUserById = async(id, user) => {

    const response = await fetch('https://localhost:7281/api/Users/' + id, {
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify(user)
    });

    return response;
}

export const DeleteUser = async (id) => {
    const response = await fetch(`https://localhost:7281/api/Users/${id}`, {
        method : 'DELETE',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    return response;
}