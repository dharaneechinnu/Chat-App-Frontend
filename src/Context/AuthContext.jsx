import { createContext, useCallback, useEffect, useState } from "react";
import api from '../Api/Api';  // Ensure the path is correct based on your project structure
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    
    console.log("registerInfo", registerInfo);

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo((prev) => ({
            ...prev,
            ...info,
        }));
    }, []);

    const register = async (registerInfo) => {
        try {
            console.log("Register data : ", registerInfo);
            const response = await api.post('/auth/register', registerInfo);
            if (response.data.status) {
                setUser(response.data.user);
                alert("Successfully registered");
                navigate('/login');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Registration error: ", error);
        }
    };

    const login = async (user) => {
        try {
            const response = await api.post('/auth/login', user);
            if (response.data.status) {
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user in local storage
                setUser(response.data.user);
                navigate('/');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Login error: ", error);
        }
    };

    const logout = useCallback(()=>{
        localStorage.removeItem("user");
        setUser(null);
        navigate('/login');
    },[navigate])

    useEffect(()=>{
        const user = localStorage.getItem("user");
        if(user)
        {
            setUser(JSON.parse(user))
        }
    },[])

    return (
        <AuthContext.Provider
            value={{
                user,
                registerInfo,
                updateRegisterInfo,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
