import "./style/App.css";
import Router from "@/Router";
import { ConfigProvider, FloatButton, theme } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "./redux/dashboard/actions";

function App() {
  const currentTheme = useSelector(state => state.home.theme);
  const dispatch = useDispatch();
  const handleChangeTheme = () => {
    dispatch(changeTheme(currentTheme == "dark" ? "default" : "dark"));
  }

  return (
    <ConfigProvider theme={{
      algorithm: currentTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
    }}>

      <Router />
      <FloatButton
        tooltip={currentTheme == "dark" ? "Light Theme" : "Dark Theme"}
        icon={currentTheme == "dark" ? <SunOutlined /> : <MoonOutlined /> }
        onClick={handleChangeTheme} />
    </ConfigProvider>

  );
}

export default App;
