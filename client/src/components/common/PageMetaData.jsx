import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title }) => {
  return (
    <Helmet>
      <title>
        {title} | Modelvi
      </title>
    </Helmet>
  );
};

export default PageMetaData;
