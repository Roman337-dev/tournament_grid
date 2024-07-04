
import axios from "axios";
import { useState, useEffect } from "react";

const host = "http://localhost:3000";
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: host,
});


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const logout = async () => {
    try {
      const response = await axiosInstance.get(`${host}/auth/user/sign-out`);
      if (response.data.success) {
        setIsAuthenticated(false);
        setIsAdmin(false); 
        window.location.href = '/';

      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (email, password) => {
    try {
      console.log(email, password);
      const response = await axiosInstance.post(
        `${host}/user/sign-in`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message==='ok') {
        setIsAuthenticated(true);
        await checkAdmin()
      }
    } catch (error) {
      console.error(error);
    }
  };
  const checkAdmin = async ()=>{
    try {
      const response = await axiosInstance.get(`${host}/auth/admin`);
      if (response.status === 200) {
        setIsAdmin(response.data.isAdmin);
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get(`${host}/auth/auth`);
			if (response.status === 200) {
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkAuth();
    checkAdmin();
  }, []);

  return { isAuthenticated,isAdmin,login, logout };
};
