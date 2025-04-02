import PageMetaData from "@/components/common/PageMetaData";
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

const LandingPage = () => {
  return (
    <>
    <PageMetaData title="Home"/>
      <TopNavBar
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
      <Pricing />
      <FAQs />
      <ContactUs />
      <Footer />
    </>
  )
}

export default LandingPage;