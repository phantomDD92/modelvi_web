
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PageMetaData from "@/components/common/PageMetaData";
import { PasswordFormInput, TextFormInput } from "@/components/form";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/contexts";


const SignIn = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginFormSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
    password: yup.string().required("Please enter your password"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      reset({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (data) => {
    const { email, password } = data;
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    }
    login(data, () => navigate("/"));
    // dispatch(registerAgency(data, () => { reset(); }))
  }

  return (
    <AuthLayout>
      <PageMetaData title="Sign In" />
      <form className="mt-2 shrink" onSubmit={handleSubmit(handleLogin)}>
        <TextFormInput
          containerClassName="mb-4"
          label="Email Address"
          name="email"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          fullWidth
          control={control}
        />
        <PasswordFormInput
          label="Password"
          containerClassName="mb-4"
          name="password"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
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
              onChange={e => setRememberMe(e.target.value)}
            />
            <label
              className="ms-2 select-none align-middle text-base/none text-zinc-200"
              htmlFor="checkbox-signin"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-pass"
            className="border-b border-dashed text-zinc-200"
          >
            <small>Forgot your password?</small>
          </Link>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="group mt-5 inline-flex w-full items-center justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:bg-primary-700 hover:text-white"
          >
            Log In
          </button>
        </div>
      </form>

      {/* <ThirdPartyAuth /> */}

      <p className="mt-4 shrink text-center text-zinc-200">
        Don't have an account ?
        <Link to="/sign-up" className="ms-1 text-primary">
          <b>Register</b>
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignIn;
