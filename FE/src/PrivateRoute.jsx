import { Navigate,useLocation} from "react-router-dom"
function PrivateRoute({auth, children }) {   
    return auth ? children : <Navigate to="/login" />;
   
}
export default PrivateRoute