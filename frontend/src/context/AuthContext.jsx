import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Check if user is logged in
	useEffect(() => {
		const checkUserLoggedIn = async () => {
			try {
				const res = await axios.get("http://localhost:8000/api/auth/authcheck", { withCredentials: true });
				console.log(res.data)
				setUser(res.data);
			} catch (error) {
				setUser(null);
			}
			setLoading(false);
		};

		checkUserLoggedIn();
	}, []);

	// Login function
	const login = async (email, password) => {
		try {
			const res = await axios.post(
				"http://localhost:8000/api/auth/login",
				{ email, password },
				{ withCredentials: true }
			);
			setUser(res.data);
			console.log("we are at login in authcontext", res.data)
		} catch (error) {
			console.error("Login failed:", error.response?.data?.message || error.message);
		}
	};

	// Logout function
	const logout = async () => {
		try {
			await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
			setUser(null);
		} catch (error) {
			console.error("Logout failed:", error.response?.data?.message || error.message);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
