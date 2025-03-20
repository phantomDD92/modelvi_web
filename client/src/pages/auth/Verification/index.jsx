import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PageMetaData from "@/components/common/PageMetaData";
import { TextFormInput } from "@/components/form";

const Verification = () => {
  const resetFormSchema = yup.object({
    code: yup.string().required("Please enter your email verification code"),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleVerification = (data) => {
    const { email, password } = data;
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    }
    dispatch(registerAgency(data, () => { reset(); }))
  }

  return (
    <>
      <PageMetaData title="Email Verification" />

      <form onSubmit={handleSubmit(handleVerification)} className="mt-10 shrink">
        <TextFormInput
          label="Verfication"
          containerClassName="mb-4"
          name="code"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />

        <div className="mb-6 flex flex-col justify-center gap-4">
          <button
            type="submit"
            className="relative inline-flex w-full items-center justify-center rounded bg-primary px-6 py-3 text-base capitalize text-white transition-all hover:bg-primary-700"
          >
            Confirm
          </button>
        </div>
      </form>
    </>
  );
};

export default Verification;
