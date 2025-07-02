import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const storedAuth = JSON.parse(localStorage.getItem('authData'));
    const isAuthenticated = storedAuth?.isAuthenticated || false;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
