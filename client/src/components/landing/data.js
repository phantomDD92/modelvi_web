import { LuComponent, LuLayers, LuLayoutGrid } from "react-icons/lu";

import agency6 from "@/assets/images/landing/agency/img-6.jpg";
import agency7 from "@/assets/images/landing/agency/img-7.jpg";
import agency8 from "@/assets/images/landing/agency/img-8.jpg";
import agency9 from "@/assets/images/landing/agency/img-9.jpg";
import agency13 from "@/assets/images/landing/agency/img-13.jpg";
import agency14 from "@/assets/images/landing/agency/img-14.jpg";
import agency15 from "@/assets/images/landing/agency/img-15.jpg";

const supportPlatforms = [
  "Fancentro",
  "F2F",
  "Fansly",
  "Fanvue",
  "Knky",
  "Maloum"
];

const pricingPlans = [
  { id: 0, price: 50.00, earnings: "$0 ~ $1000" },
  { id: 1, price: 75.00, earnings: "$1000 ~ $2500" },
  { id: 2, price: 100.00, earnings: "$2500 ~ $5000" },
  { id: 3, price: 175.00, earnings: "$5000 ~ $7500" },
  { id: 4, price: 250.00, earnings: "$10000 ~ $15000" },
  { id: 5, price: 300.00, earnings: "$15000 ~ $20000" },
  { id: 6, price: 300.00, earnings: "$20000 +" }
];

const homeSwiperSlides = [
  {
    title: "Digital agency",
    name: "Beyond a Design Agency",
    description:
      "Their ability to understand our vision and translate it into a comprehensive marketing strategy is truly exceptional.",
  },
  {
    title: "Digital agency",
    name: "Beyond a Design Agency",
    description:
      "Their ability to understand our vision and translate it into a comprehensive marketing strategy is truly exceptional.",
  },
  {
    title: "Digital agency",
    name: "Beyond a Design Agency",
    description:
      "Their ability to understand our vision and translate it into a comprehensive marketing strategy is truly exceptional.",
  },
];

const services = [
  {
    title: "Hands-Free Growth",
    description:
      "Set it up once per model and let Modelvi handle the rest—posting consistently across platforms without extra effort.",
    icon: LuComponent,
  },
  {
    title: "Data-Driven Results",
    description:
      "Optimize your strategy with real-time insights and analytics, ensuring your models get maximum exposure.",
    icon: LuLayers,
  },
  {
    title: "Multi-Platform Posting",
    description:
      "Support for FanCentro, F2F, Fansly, Fanvue, Knky, and Maloum—expand your audience effortlessly.",
    icon: LuLayoutGrid,
  },
  {
    title: "Scalable Workflows",
    description:
      "Automate posting schedules across multiple accounts, allowing agencies to scale operations seamlessly.",
    icon: LuLayoutGrid,
  },
  {
    title: "Reliable & Secure",
    description:
      "We prioritize data security and never operate as a content agency, ensuring full control remains in your hands.",
    icon: LuLayoutGrid,
  },
  {
    title: "24/7 Support",
    description:
      "Need help? Our team is always ready to assist, with both Dutch & English representatives available.",
    icon: LuLayoutGrid,
  },
];

const portfolioSlides = [
  {
    title: "Web Design",
    subTitle: "Branding Process",
    image: agency6,
  },
  {
    title: "Web Design",
    subTitle: "Digital Platform",
    image: agency7,
  },
  {
    title: "Brand",
    subTitle: "Coder Studio",
    image: agency8,
  },
  {
    title: "Web Design",
    subTitle: "New Gadgets",
    image: agency9,
  },
];

const faqContents = [
  {
    title: "What is Modelvi?",
    description:
      "Modelvi is an automation tool designed to help agencies post content across multiple platforms effortlessly, saving time and driving more traffic to models.",
  },
  {
    title: "Who is Modelvi for?",
    description:
      "For agencies and managers looking to automate workflows, increase engagement, and scale their models’ online presence.",
  },
  {
    title: "What makes Modelvi different from other tools?",
    description:
      "Unlike traditional schedulers, Modelvi fully automates content posting after an initial setup, requiring zero daily maintenance.",
  },
  {
    title: "Is my data secure?",
    description:
      "Absolutely. Modelvi does not act as a content agency, ensuring your data stays private and under your control.",
  },
  {
    title: "What features does Modelvi offer?",
    description:
      "Automated posting, analytics, traffic optimization, multi-platform support, and time-saving automation tools to streamline your workflow.",
  },
  {
    title: "How do I get started with Modelvi?",
    description:
      "Simply sign up, set up your models once, and let Modelvi handle the rest!",
  },
];

const blogs = [
  {
    title: "Brilliant minds.",
    description:
      "Lorem ipsum dolor sit amet, proin gravida nibh vel velit auctor aliquet. Aenean sollictudin, lorem quis bibendum auctor...",
    no: "06",
    image: agency13,
  },
  {
    title: "Digital Marketing.",
    description:
      "Lorem ipsum dolor sit amet, proin gravida nibh vel velit auctor aliquet. Aenean sollictudin, lorem quis bibendum auctor...",
    no: "05",
    image: agency14,
  },
  {
    title: "Good thinking.",
    description:
      "Lorem ipsum dolor sit amet, proin gravida nibh vel velit auctor aliquet. Aenean sollictudin, lorem quis bibendum auctor...",
    no: "04",
    image: agency15,
  },
];

const features = [
  {
    title: "Automated Multi-Platform Posting",
    subTitle: "For Exhibition in 2023",
  },
  {
    title: "One-Time Setup Per Model",
    subTitle: "Awarded to Muteza in 2023",
    divider: true,
  },
  {
    title: "Traffic-Boosting Strategies",
    subTitle: "Featured in 2023",
    divider: true,
  },
  {
    title: "Data & Engagement Analytics",
    subTitle: "Featured in 2023",
  },
  {
    title: "Smart Scheduling & Optimization",
    subTitle: "Interview 2023",
    divider: true,
  },
  {
    title: "Time-Saving Workflow Automation",
    subTitle: "On Display in 2023",
    divider: true,
  },
];

export { homeSwiperSlides, services, portfolioSlides, faqContents, blogs, supportPlatforms, features, pricingPlans };
