import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title }) => {
  return (
    <Helmet>
      <title>
        {title} | AeroPage React - Tailwind CSS Multipurpose One Page Landing
        Template
      </title>
    </Helmet>
  );
};

export default PageMetaData;
