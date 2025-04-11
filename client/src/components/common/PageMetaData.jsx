import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title, admin}) => {
  return (
    <Helmet>
      <title>
        {`${title} | ModelVI${admin ? " Admin" : ""}`}
      </title>
    </Helmet>
  );
};

export default PageMetaData;
