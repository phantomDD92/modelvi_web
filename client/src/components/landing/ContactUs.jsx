import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LuSend } from "react-icons/lu";
import * as yup from "yup";
import TextFormInput from "./TextFormInput";
import TextAreaFormInput from "./TextAreaFormInput";
import { useDispatch } from "react-redux";
import { sendContact } from "@/redux/dashboard/actions";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
const ContactUs = () => {
  const [waiting, setWaiting] = useState(false);
  const dispatch = useDispatch();
  const contactFormSchema = yup.object({
    name: yup.string().required("Please enter your name"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
    subject: yup.string().required("Please enter your subject"),
    message: yup.string().required("Please enter your message"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(contactFormSchema),
  });

  const handleSendContact = (formData) => {
    setWaiting(true);
    dispatch(sendContact(formData, () => { setWaiting(false); reset(); }));
  }

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Contact Sales
          </span>
          <h2 className="mt-4 text-4xl/tight font-medium text-default-950">
            Contact
          </h2>
          <p className="mt-5 text-lg">
            Modelvi takes the hassle out of content posting so you can focus on growing your agency. Ready to scale smarter? Get started today! 🚀
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-md border border-default-300 bg-white p-8 dark:bg-default-50">
            <form onSubmit={handleSubmit(handleSendContact)} className="relative">
              <h2 className="mb-5 text-2xl font-medium text-default-950">
                How can we help you?
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <TextFormInput
                  name="name"
                  label="Name"
                  labelClassName="text-default-500"
                  className="text-sm"
                  placeholder="Your name..."
                  control={control}
                  fullWidth
                />
                <TextFormInput
                  name="email"
                  label="Email"
                  type="email"
                  labelClassName="text-default-500"
                  className="text-sm"
                  placeholder="Your email..."
                  control={control}
                  fullWidth
                />
                <div className="sm:col-span-2">
                  <TextFormInput
                    name="subject"
                    label="Subject"
                    labelClassName="text-default-500"
                    className="text-sm"
                    placeholder="Type subject..."
                    control={control}
                    containerClassName="mb-3"
                    fullWidth
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextAreaFormInput
                    name="message"
                    label="Messages"
                    labelClassName="text-default-500"
                    className="text-sm"
                    rows={4}
                    placeholder="Type messages..."
                    containerClassName="mb-4"
                    control={control}
                    fullWidth
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center rounded-md bg-primary/90 px-6 py-2 text-white transition-all hover:bg-primary"
              >
                Send Messages
                {waiting
                  ? <LoadingOutlined className="ms-2 size-5" />
                  : <LuSend className="ms-2 size-5 rotate-45" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
