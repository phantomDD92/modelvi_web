import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PageMetaData, TextFormInput, ThirdPartyAuth } from "@/components";
const ForgotPassword = () => {
  const resetFormSchema = yup.object({
    email: yup.string().required("Please enter your email"),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetFormSchema),
    defaultValues: {
      email: "user@demo.com",
    },
  });
  return (
    <>
      <PageMetaData title="Forgot Password" />

      <form onSubmit={handleSubmit(() => {})} className="mt-10 shrink">
        <TextFormInput
          containerClassName="mb-4"
          label="Email address"
          name="email"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          placeholder="Enter your email"
          fullWidth
          control={control}
        />
        <div className="mb-6 flex flex-col justify-center gap-4">
          <button
            type="submit"
            className="relative inline-flex w-full items-center justify-center rounded bg-primary px-6 py-3 text-base capitalize text-white transition-all hover:bg-primary-700"
          >
            Forgot Password
          </button>
          <Link
            to="/auth/sign-in"
            className="relative inline-flex w-full items-center justify-center rounded border border-primary px-6 py-3 text-base capitalize text-primary transition-all hover:bg-primary hover:text-white"
          >
            Go to Login
          </Link>
        </div>
      </form>

      <ThirdPartyAuth />

      <p className="shrink text-center text-zinc-200">
        Already have an account ?
        <Link to="/auth/sign-in" className="ms-1 text-primary">
          <b>Login</b>
        </Link>
      </p>
    </>
  );
};

export default ForgotPassword;
