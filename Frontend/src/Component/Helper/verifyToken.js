import { useHistory } from "react-router-dom";

export const VerifyToken = () => {
    const history = useHistory();
    const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
    !token && history.push("/");
};
