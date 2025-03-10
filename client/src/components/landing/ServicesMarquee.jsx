import { supportPlatforms } from "./data";

const ServicesMarquee = () => {
  return (
    <section>
      <div className="relative gap-28 m-auto flex overflow-hidden border border-default-200 py-6">
        <div className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full">
          {supportPlatforms.map(platform =>
            <h2 key={platform} className="text-4xl font-medium text-default-950">{platform}</h2>
          )}
        </div>
        <div
          aria-hidden="true"
          className="marquee__group gap-28 flex items-center justify-around flex-shrink-0 min-w-full"
        >
          {supportPlatforms.map(platform =>
            <h2 key={platform} className="text-4xl font-medium text-default-950">{platform}</h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesMarquee;
