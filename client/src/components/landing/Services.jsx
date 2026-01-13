import { services } from "./data";


const Services = () => {
  return (
    <section id="services" className="py-10 lg:py-20">
      <div className="container">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Services
          </span>
          <h2 className="mt-3 text-3xl font-medium text-default-950 md:text-4xl">
            Why Choose Modelvi?
          </h2>
          <p className="mt-5 text-base">
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {services.map((service, idx) => {
            return (
              <div key={idx}>
                <div className="flex flex-wrap gap-5 rounded-lg border border-default-200 bg-white p-6 shadow dark:bg-default-50 md:flex-nowrap">
                  <div>
                    <div className="flex w-10 h-10 items-center justify-center rounded-md bg-default-900 text-xl text-default-50">
                      {idx + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 text-xl font-medium text-default-950 md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mb-4 font-medium md:text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
