import "./style/App.css";
import Router from "@/Router";
import { ConfigProvider, FloatButton, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AuthProvider, LayoutProvider } from "./contexts";
import { HelmetProvider } from "react-helmet-async";
import { changeTheme } from "./redux/v2/actions";
import { LuMoon, LuSun } from "react-icons/lu";

function App() {
  const currentTheme = useSelector(state => state.v2.theme);
  const dispatch = useDispatch();

  const handleChangeTheme = () => {
    dispatch(changeTheme(currentTheme == "dark" ? "default" : "dark"));
  }

  return (
    <HelmetProvider>
      <ConfigProvider theme={{
        algorithm: currentTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}>
        <AuthProvider>
          <LayoutProvider theme={currentTheme}>
            <Router />
            <FloatButton
              tooltip={currentTheme == "dark" ? "Light Theme" : "Dark Theme"}
              icon={currentTheme == "dark" ? <LuSun /> : <LuMoon />}
              onClick={handleChangeTheme} />
          </LayoutProvider>
        </AuthProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}

export default App;
