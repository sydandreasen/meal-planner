import React, { useState } from "react";
import { Button, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CalendarOutlined,
  // ContainerOutlined,
  // ProfileOutlined,
  PoweroffOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../SCSS/NavMenu.scss";
import base from "./Firebase";

// navigation between pages
function NavMenu(props) {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const toggleCollapsed = () => setMenuCollapsed(!menuCollapsed);

  if (props.selected && props.selected.length > 0) {
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
          defaultSelectedKeys={[props.selected]}
          mode="inline"
          inlineCollapsed={menuCollapsed}
        >
          <Menu.Item
            key="meal planning"
            icon={<CalendarOutlined />}
            onClick={() => props.page("meal planning")}
          >
            Meal Planning
          </Menu.Item>
          {/* <Menu.Item
            key="recipes"
            icon={<ContainerOutlined />}
            onClick={() => props.page("recipes")}
          >
            Recipes
          </Menu.Item>
          <Menu.Item
            key="groceries"
            icon={<ProfileOutlined />}
            onClick={() => props.page("groceries")}
          >
            Groceries
          </Menu.Item> */}
          <Menu.Item
            key="settings"
            icon={<SettingOutlined />}
            onClick={() => props.page("settings")}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            key="sign out"
            icon={<PoweroffOutlined />}
            onClick={() => {
              base.auth().signOut();
              localStorage.clear();
            }}
          >
            Sign Out
          </Menu.Item>
        </Menu>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default NavMenu;
