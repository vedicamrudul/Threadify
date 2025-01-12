import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../../../components/svgs/Logo"; // Ensure the path to Logo is correct
import { MdOutlineMail, MdPassword } from "react-icons/md"; // Correctly importing icons
import { FaUser } from "react-icons/fa"; // Importing missing icon

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [isError, setIsError] = useState(false); // Added state for error handling

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form Data Submitted:", formData);

		// Mock error check (replace with actual logic)
		if (!formData.username || !formData.password) {
			setIsError(true);
		} else {
			setIsError(false);
			// Proceed with login logic
		}
	};

	// Handle input changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10">
			{/* Left Section */}
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<Logo className="w-[25vw] h-[25vw] mx-auto" />
			</div>

			{/* Right Section */}
			<div className="flex-1 flex flex-col justify-center items-center">
				<form
					className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
					onSubmit={handleSubmit}
				>
					{/* Logo for small screens */}
					<Logo className="w-24 lg:hidden fill-white" />
					<h1 className="text-4xl font-extrabold text-white">Start Tweeting.</h1>

					{/* Username Input */}
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<FaUser />
							<input
								type="text"
								className="grow"
								placeholder="Username"
								name="username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					</div>

					{/* Password Input */}
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword />
						<input
							type="password"
							className="grow"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					{/* Submit Button */}
					<button
						type="submit"
						className="btn rounded-full btn-primary text-white"
					>
						Login
					</button>

					{/* Error Message */}
					{isError && (
						<p className="text-red-500">Please fill out all fields</p>
					)}
				</form>

				{/* Sign-in Option */}
				<div className="flex flex-col lg:w-2/3 gap-2 mt-4">
					<p className="text-white text-lg">Don't have an account?</p>
					<Link to="/signup">
						<button className="btn rounded-full btn-primary text-white btn-outline w-full">
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
