import { Layout, theme, Typography } from "antd";

const LandingHeader = () => {
  return (
    <header class="fixed w-full">
      <nav class="py-2.5">
        <div class="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <a href="#" class="flex items-center">
            <span class="self-center text-xl font-semibold whitespace-nowrap">ModelVI</span>
          </a>
          <div class="flex items-center lg:order-2">
            <a href="https://themesberg.com/product/tailwind-css/landing-page" class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none dark:focus:ring-purple-800">Login</a>
            <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
              <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
          <div class="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1 text-lg" id="mobile-menu-2">
            <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 list-none">
              {["Home", "Service", "Pricing", "Features", "Faq", "Contact"].map(item =>
                <li key={item}>
                  <a href="#" class="block py-2 pl-3 pr-4 rounded lg:p-0" aria-current="page">
                    {`${item}`}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

const LandingIntro = () => {
  return (
    <section class="bg-white dark:bg-gray-900 py-36">
      <div class="grid lg:grid-cols-2 gap-4 items-center">
        <div class="max-w-lg text-center lg:text-start">
          <h2 class="lg:text-6xl/tight sm:text-5xl text-4xl font-medium text-default-950">
            Effortless Multi-Platform Chatting
          </h2>
          <p class="text-base font-medium my-6">
            Manage your content, engage with fans, and scale your creator business—all in one place.
          </p>
          <a class="inline-flex items-center justify-center gap-2 border border-[#4361EE]/50 text-[#4361EE] py-2 px-6 rounded-md bg-[#4361EE]/10 hover:text-white hover:bg-[#4361EE] transition-all duration-500">CONTACT SALES</a>
        </div>
      </div>
    </section>
  )
}

const LandingSlider = () => {
  return (
    <section>
      <div class="relative gap-28 m-auto flex overflow-hidden border border-default-200 py-8">
        <div class="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          <div class="py-3">
            <h2 class="flex text-5xl font-medium text-default-950">ONLYFANS</h2>
          </div>
          <div class="py-3">
            <h2 class="text-5xl font-medium text-default-950">FANSLY</h2>
          </div>
          <div class="py-3">
            <h2 class="text-5xl font-medium text-default-950">FANCENTRO</h2>
          </div>
          <div class="py-3">
            <h2 class="text-5xl font-medium text-default-950">F2F</h2>
          </div>
        </div>
        <div aria-hidden="true" class="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          <div class="py-3">
            <h2 class="flex text-5xl font-medium text-default-950">ONLYFANS</h2>
          </div>
          <div class="py-3">
            <h2 class="text-5xl font-medium text-default-950">FANSLY</h2>
          </div>
          <div class="py-3">
            <h2 class="text-5xl font-medium text-default-950">FANCENTRO</h2>
          </div>
          <div class="py-3">
            <h2 class="text-5xl font-medium text-default-950">F2F</h2>
          </div>
        </div>
      </div>
    </section>
  )
}

const LandingServices = () => {
  const services = [
    { key: "data_security", icon: "", title: "Data security", description: "Your privacy is our priority. We don’t operate as a content agency, ensuring your data remains confidential and secure." },
    { key: "reliable_uptime", icon: "", title: "Reliable Uptime", description: "Our robust infrastructure guarantees consistent service, minimizing downtime and disruptions. We promise ;)" },
    { key: "optimized_performance", icon: "", title: "Optimized Performance", description: "Experience faster communication with our streamlined chat solution, designed to enhance your productivity." },
    { key: "expert_team", icon: "", title: "Expert Team", description: "Our team comprises professionals with backgrounds in leading tech companies, bringing top-tier expertise to DirtyDialogues." },
    { key: "compliance_safety", icon: "", title: "Compliance and Safety", description: "We adhere strictly to platform guidelines, keeping your accounts safe and compliant. No reported bans" },
    { key: "responsive_support", icon: "", title: "Responsive Support", description: "Our dedicated support team is available around the clock to assist you whenever needed. Dutch & English representatives" },
  ]

  const serviceItem = ({ title, description }) =>
    <div class="sm:p-10 p-8">
      <span >
        <lucide-angular name="lock" class="h-10 w-10 text-default-950">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock h-10 w-10 text-default-950">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" key="1w4ew1"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" key="fwvmzm"></path>
          </svg>
        </lucide-angular>
      </span>
      <h2 class="text-2xl font-medium text-default-950 mb-4 mt-8">
        {title}
      </h2>
      <p class="text-base text-default-600 mb-6">
        {description}
      </p>
    </div>;

  return (
    <section id="why" class="lg:py-20 py-10">
      <div class="container m-auto">
        <div class="flex items-end justify-between mb-10">
          <div class="max-w-2xl mx-auto text-center">
            <span class="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-default-300 text-default-950">Services</span>
            <h2 class="text-4xl font-medium capitalize text-default-950 my-4">Why choose DirtyDialogues?</h2>
          </div>
        </div>
        <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center rounded-md overflow-hidden border border-default-200">
          <div className="group border-default-200">
            {serviceItem(services[0])}
          </div>
          <div className="group border-default-200">
            {serviceItem(services[1])}
          </div>
          <div className="group border-default-200">
            {serviceItem(services[2])}
          </div>
        </div>
        <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center rounded-md overflow-hidden border border-default-200">
          <div className="group border-default-200">
            {serviceItem(services[3])}
          </div>
          <div className="group border-default-200">
            {serviceItem(services[4])}
          </div>
          <div className="group border-default-200">
            {serviceItem(services[5])}
          </div>
        </div>
      </div >
    </section >
  )
}

const LandingFeatures = () => {

  const features = [
    "Central Chatting & Content Management",
    "Multi-User Collaboration",
    "Fan Notes at a Glance",
    "Data-Driven Insights",
    "Analytics & Payouts",
    "Track Online Users",
  ]
  const featureItem = (feature) =>
    <div class="p-6 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-default-950">{feature}</h3>
      <div >
        <div class="h-12 w-12 rounded-md flex items-center justify-center transition-all duration-500 border border-default-200 text-default-950 hover:text-[#4361EE] bg-default-50 hover:bg-white">
          <lucide-angular name="check" class="w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-6 h-6">
              <path d="M20 6 9 17l-5-5" key="1gmf2c"></path>
            </svg>
          </lucide-angular>
        </div>
      </div>
    </div>

  return (
    <section id="features" className="lg:py-20 py-10">
      <div className="container m-auto">
        <div class="flex items-end justify-center mb-10">
          <div class="max-w-md mx-auto text-center">
            <span class="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-default-200 text-default-950">Features</span>
            <h2 class="text-3xl font-medium capitalize text-default-950 mt-4">Highlighted Features</h2>
          </div>
        </div>
        <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
          <div className="grid 2xl:grid-cols-2">
            <div className="divide-y divide-default-200">
              {features.slice(0, 3).map(feature => featureItem(feature))}
            </div>
            <div className="2xl:border-s 2xl:border-t-0 border-t border-default-200 divide-y divide-default-200">
              {features.slice(3, 6).map(feature => featureItem(feature))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const LandingFaqs = () => {
  const faqs = [
    { key: "faq-1", title: " What is DirtyDialogues? ", description: "DirtyDialogues is a SaaS platform designed to help agencies manage chatting workflows across multiple platforms, enabling efficient scaling and revenue growth." },
    { key: "faq-2", title: " Who is DirtyDialogues for? ", description: "It’s ideal for OnlyFans agencies, content creators, and chatters who want to streamline their operations and manage multiple accounts effectively." },
    { key: "faq-3", title: " What makes DirtyDialogues different from other tools? ", description: "Unlike others, DirtyDialogues focuses on simplicity, compatibility, and multi-platform integration, allowing you to manage more creators per chatter for faster scaling." },
    { key: "faq-4", title: " Is my data secure? ", description: "Yes, we prioritize your privacy. DirtyDialogues does not operate as a content agency, ensuring your data stays safe and confidential." },
    { key: "faq-1", title: " What features does DirtyDialogues offer? ", description: "Core features include cross-platform support, fan notes for personalized interactions, data-driven insights, and tools for seamless team collaboration." },
    { key: "faq-1", title: " How do I get started with DirtyDialogues? ", description: "Sign up is quick and easy. Create an account, onboard your chatters and creators, and start scaling your operations in minutes." },
  ]
  const faqItem = ({ key, title, description }) =>
    <div id={key} class="hs-accordion border border-default-200 rounded-lg overflow-hidden">
      <button aria-controls={key} class="hs-accordion-toggle capitalize px-6 py-4 inline-flex items-center justify-between gap-x-3 w-full text-left text-default-950 transition-all">
        <h5 class="text-base font-semibold flex"> {title} </h5>
        <lucide-angular name="chevron-up" class="h-4 w-4 transition-all duration-500 rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up h-4 w-4 transition-all duration-500"><path d="m18 15-6-6-6 6" key="153udz"></path></svg>
        </lucide-angular>
      </button>
      <div aria-labelledby={key} class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300">
        <div class="px-6 pb-4 pt-0">
          <p class="text-sm font-medium text-default-600">{description}</p>
        </div>
      </div>
    </div>;
  return (
    <section id="faq" className="lg:py-20 py-10">
      <div className="container m-auto">
        <div class="flex items-end justify-between mb-10">
          <div class="max-w-2xl mx-auto text-center">
            <span class="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-default-300 text-default-950">Our FAQ</span>
            <h2 class="text-3xl font-medium capitalize text-default-950 my-4">Frequently Asked Questions ?</h2>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 items-center">
        <div></div>
        <div className="lg:pb-20">
          <div className="hs-accordion-group space-y-4">
            {faqs.map(faq => faqItem(faq))}
          </div>
        </div>
      </div>
    </section>
  )
}

const LandingContact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container m-auto">
        <div class="max-w-3xl mx-auto text-center mb-14">
          <span class="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-default-200 text-default-950">Contact Sales</span>
          <h2 class="text-4xl/tight font-medium text-default-950 mt-4"> Let's Begin a Dialogue </h2>
          <p class="text-lg font-medium mt-5"> We're eager to engage with like-minded individuals. Simply greet us, and we'll embark on a productive collaboration. Launch your own journey to success. </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="p-8 rounded-md border border-default-300 bg-white dark:bg-default-50">
          <form className="relative ng-untouched ng-pristine ng-invalid">
            <h2 className="text-2xl font-medium text-default-950 mb-5">
            How can we help you? 
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
const LandingBody = () => {
  return <>
    <LandingIntro />
    <LandingSlider />
    <LandingServices />
    <LandingFeatures />
    <LandingFaqs />
    {/* <LandingPricePlans /> */}
    <LandingContact />
  </>
}

const LandingFooter = () => {
  return <footer className="bg-white dark:bg-gray-800">Footer</footer>
}

const LandingPage = () => {
  const { token: { colorBgContainer } } = theme.useToken();
  return <>
    <LandingHeader />
    <LandingBody />
    <LandingFooter />
  </>
}

export default LandingPage;