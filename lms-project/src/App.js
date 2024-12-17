import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/Root.jsx';
import HomePage from './LeaveUI/Home.jsx';
import LoginPage from './LeaveUI/Login.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import LeaveList from './LeaveUI/LeaveList.jsx';
import NewLeaveRequest from './LeaveUI/NewLeave.jsx';
import EditLeave from './LeaveUI/EditLeave.jsx';
import ManagerRequestsPage from './LeaveUI/ManagerRequests.jsx';
import NewUserPage from './UserUI/NewUser.jsx';
import UserList from './UserUI/UserList.jsx';
import EditUser from './UserUI/EditUser.jsx';

const router = createBrowserRouter([
  {path : '/', element : <RootLayout/>, children : [
    {path : '/', element : <HomePage/>},
    {path : '/login', element : <LoginPage/>},
    {path : '/list', element : <PrivateRoute element={<LeaveList/>}/>},
    {path : '/addLeave', element : <PrivateRoute element={<NewLeaveRequest/>}/>},
    {path : '/edit/:id', element : <PrivateRoute element={<EditLeave/>}/>},
    {path : '/requests', element : <PrivateRoute element={<ManagerRequestsPage/>}/>},
    {path : '/addUser', element : <PrivateRoute element={<NewUserPage/>}/>},
    {path : '/userList', element : <PrivateRoute element={<UserList/>}/>},
    {path : '/editUser/:id', element : <PrivateRoute element={<EditUser/>}/>},
  ]}
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
