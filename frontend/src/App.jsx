import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUp from "./pages/auth/signup/SignUp";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
function App(){
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      {/* anything outside routes is common commonent as itss not wrapped in routes */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;