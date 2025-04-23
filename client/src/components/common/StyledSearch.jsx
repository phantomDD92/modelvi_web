import { useSelector } from "react-redux";
import { Input } from "antd";
import clsx from "clsx";

const StyledSearch = ({ className, ...params }) => {
  const currentTheme = useSelector(state => state.home.theme);
  return (
    <Input.Search
      className={clsx(currentTheme === "dark" ? "dark-theme" : "light-theme", className)}
      {...params} />
  )
}

export default StyledSearch;