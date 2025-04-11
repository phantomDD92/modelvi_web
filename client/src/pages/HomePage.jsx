import { useNavigate } from "react-router-dom";
import { PageMetaData } from "@/components/common";
import {
  TopNavBar,
  Hero,
  ServicesMarquee,
  ContactUs,
  FAQs,
  Features,
  Pricing,
  Footer,
  Services
} from "@/components/landing";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAffiliateClick } from "@/redux/v2/actions";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refCode, setRefCode] = useState();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const referralCode = queryParams.get('ref');
    if (referralCode) {
      setRefCode(referralCode)
      dispatch(setAffiliateClick(referralCode));
    }
  }, []);

  return (
    <>
      <PageMetaData title="Home" />
      <TopNavBar
        referralCode={refCode}
        position="fixed"
        menuItems={[
          "home",
          "services",
          "features",
          "faq",
          "pricing",
          "contact",
        ]}
      />
      <Hero />
      <ServicesMarquee />
      <Services />
      <Features />
      <Pricing referralCode={refCode} />
      <FAQs />
      <ContactUs />
      <Footer />
    </>
  )
}

export default HomePage;