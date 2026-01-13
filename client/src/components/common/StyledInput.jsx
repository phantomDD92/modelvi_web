import { useSelector } from "react-redux";
import { Input } from "antd";
import clsx from "clsx";

const StyledInput = ({ className, ...params }) => {
  const currentTheme = useSelector(state => state.v2.theme);
  return (
    <Input
      className={clsx(currentTheme === "dark" ? "dark-theme" : "light-theme", className)}
      {...params} />
  )
}

export default StyledInput;