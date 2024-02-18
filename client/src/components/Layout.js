import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const userMenu = [
    {
      key: 1,
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      key: 2,
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      key: 3,
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    }
  ];

  const doctorMenu = [
    {
      key: 1,
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      key: 2,
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      key: 3,
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      key: 1,
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      key: 2,
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      key: 3,
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-star-line",
    },
    {
      key: 4,
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main bg">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">{collapsed?"MF":"MediFlex"}</h1>
            <h1 className="role">{role}</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <Link  to={menu.path}><i className={menu.icon}></i></Link>
                  {!collapsed && <Link className="nav-links" to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item `}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              
              <Link to="/login"><i className="ri-logout-circle-line"></i></Link>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header transparent">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>

              <p className="anchor mx-2">
                {user?.name}
              </p>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
