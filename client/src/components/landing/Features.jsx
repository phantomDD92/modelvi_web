import { Link } from "react-router-dom";
import { features } from "./data";
import { LuArrowUpRight } from "react-icons/lu";
import { cn } from "@/utils";

const Features = () => {
  return (
    <section id="features" className="py-10 lg:py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-medium capitalize text-default-950 md:text-4xl">
              Highlighted Features
            </h2>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 lg:gap-6  lg:grid-cols-2">
            <div>
              {features.slice(0, 3).map((item, idx) => {
                return (
                  <Link key={idx} to="" className="group">
                    <div
                      className={cn(
                        "flex items-center justify-between p-5",
                        item.divider ? "border-y border-default-200" : ""
                      )}
                    >
                      <div>
                        <h2 className="text-2xl font-medium text-default-950">
                          {item.title}
                        </h2>
                        {/* <p className="mt-1 text-base">{item.subTitle}</p> */}
                      </div>
                      <div>
                        <div className="flex w-10 h-10 items-center justify-center rounded-full border border-default-200 text-default-950 transition-all duration-500 group-hover:border-transparent group-hover:bg-black group-hover:text-white">
                          <LuArrowUpRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div>
              {features.slice(3, 6).map((item, idx) => {
                return (
                  <Link key={idx} to="" className="group">
                    <div
                      className={cn(
                        "flex items-center justify-between p-5",
                        item.divider ? "border-y border-default-200" : ""
                      )}
                    >
                      <div>
                        <h2 className="text-2xl font-medium text-default-950">
                          {item.title}
                        </h2>
                        {/* <p className="mt-1 text-base">{item.subTitle}</p> */}
                      </div>
                      <div>
                        <div className="flex w-10 h-10 items-center justify-center rounded-full border border-default-200 text-default-950 transition-all duration-500 group-hover:border-transparent group-hover:bg-black group-hover:text-white">
                          <LuArrowUpRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
