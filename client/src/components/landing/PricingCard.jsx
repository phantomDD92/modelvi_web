import { LuDot } from "react-icons/lu";
import { Link } from "react-router-dom";

const PricingCard = ({ pricingPlan }) => {
  const { day, features, name, price } = pricingPlan;
  return (
    <div className="group relative shadow rounded-md z-2 bg-default-100 dark:bg-default-50">
      <div className="p-6 py-8">
        <h6 className="font-bold uppercase mb-5 text-primary">{name}</h6>
        <div className="flex mb-2 text-default-950">
          <span className="text-xl font-semibold">$</span>
          <span className="price text-4xl font-semibold mb-0">{price}</span>
          <span className="text-xl font-semibold self-end mb-1">/mo</span>
        </div>
        <p>{day} days free</p>
        <ul role="list" className="mt-4 mb-5 -ms-3 text-sm text-default-white">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 py-1">
              <LuDot className="inline-block h-8 w-8 stroke-primary" />
              <span className="text-base text-default-950">{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          to=""
          className="border inline-block  border-primary/50 text-primary py-2 px-6 rounded-md bg-primary/10 hover:text-white hover:bg-primary transition-all duration-300"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
