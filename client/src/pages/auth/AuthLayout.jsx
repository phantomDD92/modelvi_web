import { Suspense } from "react";
import { Link } from "react-router-dom";

import authBgImg from "@/assets/images/auth-bg.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat p-2 lg:p-0"
      style={{ backgroundImage: `url("${authBgImg}")` }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="flex h-screen w-full items-center justify-center">
        <div className="max-w-4xl overflow-hidden rounded-lg bg-black/60 backdrop-blur-3xl">
          {/* <div className="grid lg:grid-cols-2"> */}
            {/* <div className="hidden py-2.5 ps-2.5 lg:block">
              <div className="relative h-full overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-black/40" />
                <img src={otherAuthImg} className="h-full max-w-full" />
              </div>
            </div> */}
            {/* <div> */}
              <div className="p-12 pt-16 flex h-full flex-col">
                <Link to="/signin" className="mb-8 block shrink">
                  {/* <img className="h-8" src={logoLight} alt="images" /> */}
                  <h3 className="font-bold uppercase text-3xl text-white text-center">Modelvi</h3>
                </Link>
                <Suspense fallback={<div />}>{children}</Suspense>
              </div>
            {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
