import { pricingPlans } from "./data";
import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [selected, setSelected] = useState(0);
  return (
    <section id="pricing" className="lg:py-20 py-10">
      <div className="container">
        <div className="grid xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">
              Pricing
            </span>
            <h2 className="text-4xl font-medium text-default-950 mt-6">
              Affordable & Scalable
            </h2>
            <hr className="my-6 border border-dashed text-default-800 hidden xl:block" />
            <ul role="list" className="mt-4 text-sm text-default-white">
              <li className="flex items-center gap-2 py-1">
                <span className="text-base text-default-950">
                  💰 Fair, Performance-Based Pricing
                </span>
              </li>
              <li className="flex items-center gap-2 py-1">
                {/* <LuMoveRight className="inline-block h-6 w-6 stroke-primary" /> */}
                <span className="text-base text-default-950">
                  📈 Flexible Pay-As-You-Go Model
                </span>
              </li>
              <li className="flex items-center gap-2 py-1">
                {/* <LuMoveRight className="inline-block h-6 w-6 stroke-primary" /> */}
                <span className="text-base text-default-950">
                  🔄 Dynamic Pricing for Agencies of All Sizes
                </span>
              </li>
              <li className="flex items-center gap-2 py-1">
                {/* <LuMoveRight className="inline-block h-6 w-6 stroke-primary" /> */}
                <span className="text-base text-default-950">
                  🛠 No Hidden Fees—Only Pay for What You Use
                </span>
              </li>
            </ul>
          </div>
          <div className="xl:col-span-2 mt-8 lg:mt-0">
            <div className="lg:ms-8">
              <div className="group relative shadow rounded-md z-2 bg-default-100 dark:bg-default-50">
                <div className="p-6 py-8">
                  <h2 className="font-bold uppercase mb-5 text-primary text-lg">Pay Monthly</h2>
                  <p>*Price Per Platform</p>
                  <h6 className="font-bold mt-2 mb-2">
                    Enter your Creator's monthly earnings:
                  </h6>
                  <select className="w-full rounded-md mb-2" value={selected} onChange={e => setSelected(e.target.value)}>
                    {pricingPlans.map(plan =>
                      <option key={plan.id} value={plan.id}>{plan.earnings} </option>
                    )}
                  </select>
                  <p>Starting at just</p>
                  <div className="flex text-default-950">
                    <span className="text-xl font-semibold">$</span>
                    <span className="price text-4xl font-semibold mb-0">{pricingPlans[selected].price.toFixed(2)}</span>
                    <span className="text-xl font-semibold self-end mb-1">/mo</span>
                  </div>
                  <p>Billed monthly</p>
                  <div className="flex mt-5 justify-between">
                    <a
                      href="#contact"
                      className="inline-flex items-center min-w-[144px] justify-center gap-2 border border-primary/50 text-primary p-2 rounded-md bg-primary-600 text-center text-base text-white transition-all hover:bg-primary-700"
                    >
                      CONTACT SALES
                    </a>
                    <Link
                      to="/sign-up"
                      className="inline-flex items-center min-w-[144px] justify-center gap-2 border border-purple-700 text-purple p-2 rounded-md bg-purple-600 text-center text-base text-white transition-all hover:bg-purple-700"
                    >
                      SIGN UP
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
