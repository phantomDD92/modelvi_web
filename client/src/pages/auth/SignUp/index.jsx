
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PageMetaData from "@/components/common/PageMetaData";
import { PasswordFormInput, TextFormInput } from "@/components/form";
import AuthLayout from "../AuthLayout";
import { registerAgency } from "@/redux/v2/actions";

const SignUp = () => {

  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();

  const registerFormSchema = yup.object({
    name: yup.string().required("Please enter your name"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
    telegram: yup.string().required("Please enter your telegram id"),
    password: yup.string().required("Please enter your password"),
  });
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(registerFormSchema),
  });

  const handleRegister = (data) => {
    const { email, password } = data;
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    }
    dispatch(registerAgency(data, () => { reset(); }))
  }

  return (
    <AuthLayout>
      <PageMetaData title="Sign Up" />
      <form onSubmit={handleSubmit(handleRegister)} className="mt-2 shrink">
        <TextFormInput
          containerClassName="mb-4"
          label="Agency Name"
          name="name"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          fullWidth
          placeholder="Enter your Name"
          control={control}
        />
        <TextFormInput
          containerClassName="mb-4"
          label="Email Address"
          name="email"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          placeholder="Enter your email"
          fullWidth
          control={control}
        />
        <TextFormInput
          containerClassName="mb-4"
          label="Telegram"
          name="telegram"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          placeholder="Enter your telegram"
          fullWidth
          control={control}
        />
        <PasswordFormInput
          label="Password"
          containerClassName="mb-4"
          name="password"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          placeholder="Enter your password"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-1 gap-y-2">
          <div className="inline-flex items-center">
            <input
              type="checkbox"
              className="size-4 rounded border-white/20 bg-white/20 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary/60 focus:ring-offset-0"
              id="checkbox-signin"
              value={rememberMe}
              onChange={e => { console.log("HERE"); setRememberMe(e.target.value) }}
            />
            <label
              className="ms-2 select-none align-middle text-base/none text-zinc-200"
              htmlFor="checkbox-signin"
            >
              Remember me
            </label>
          </div>
        </div>
        <div className="text-center">
          <button
            className="group mt-5 inline-flex w-full items-center justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:bg-primary-700 hover:text-white"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>

      {/* <ThirdPartyAuth /> */}

      <p className="shrink text-center text-zinc-200">
        Already have an account ?
        <Link to="/sign-in" className="ms-1 text-primary">
          <b>Login</b>
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
