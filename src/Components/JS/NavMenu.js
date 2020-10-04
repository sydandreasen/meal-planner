import React, { useState } from "react";
import { Button, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CalendarOutlined,
  ContainerOutlined,
  ProfileOutlined,
  PoweroffOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../SCSS/NavMenu.scss";
import application from "./Firebase";

function NavMenu(props) {
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  const toggleCollapsed = () => setMenuCollapsed(!menuCollapsed);
  return (
    <div className="nav-menu">
      <Button
        className="toggle-nav"
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        inlineCollapsed={menuCollapsed}
      >
        <Menu.Item
          key="1"
          icon={<CalendarOutlined />}
          onClick={() => props.page("meal planning")}
        >
          Meal Planning
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<ContainerOutlined />}
          onClick={() => props.page("recipes")}
        >
          Recipes
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<ProfileOutlined />}
          onClick={() => props.page("groceries")}
        >
          Groceries
        </Menu.Item>{" "}
        <Menu.Item
          key="4"
          icon={<SettingOutlined />}
          onClick={() => props.page("settings")}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<PoweroffOutlined />}
          onClick={() => {
            application.auth().signOut();
            localStorage.clear();
          }}
        >
          Sign Out
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default NavMenu;
