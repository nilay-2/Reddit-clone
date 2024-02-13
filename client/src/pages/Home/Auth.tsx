import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { login, signup } from "../../app/reducers/authReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
interface AuthOptions {
  authenticationType: string;
  formTitle: string;
  submitTitle: string;
}

export interface Credentials {
  email: string;
  password: string;
  username?: string;
}

const Auth: React.FC<{
  setOpenAuth: React.Dispatch<React.SetStateAction<Boolean>>;
}> = ({ setOpenAuth }) => {
  // auth type
  const [authType, setAuthType] = useState<AuthOptions>({
    authenticationType: "sign_in",
    formTitle: "Sign in to your account",
    submitTitle: "Sign in",
  });

  const dispatch = useDispatch<AppDispatch>();

  // submit handler
  const onSubmit: SubmitHandler<Credentials> = async (data) => {
    if (authType.authenticationType === "sign_up") {
      dispatch(signup(data));
    } else {
      dispatch(login(data));
    }
    reset();
  };

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Credentials>();

  const closeAuthBox = () => {
    setOpenAuth(false);
  };

  const toggleAuthType = () => {
    reset();
    if (authType.authenticationType === "sign_in") {
      setAuthType((prev) => {
        return {
          ...prev,
          authenticationType: "sign_up",
          formTitle: "Create account",
          submitTitle: "Sign up",
        };
      });
      return;
    }

    setAuthType((prev) => {
      return {
        ...prev,
        authenticationType: "sign_in",
        formTitle: "Sign in to your account",
        submitTitle: "Sign in",
      };
    });
  };

  return (
    <div className="w-screen h-screen fixed inset-0 bg-opacity-35 backdrop-blur-sm bg-black text-white z-20 md:flex md:items-center">
      <div className="md:w-96 w-full md:h-fit h-full md:mx-auto flex flex-col justify-center px-6 py-12 lg:px-8 bg-white rounded-lg relative">
        <div className="w-fit text-black absolute top-5 right-5">
          <button
            onClick={closeAuthBox}
            className="px-2 py-1 rounded-full bg-red-600 text-white max-h-6 flex items-center hover:bg-red-500 active:bg-red-600"
          >
            Close
          </button>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {authType.formTitle}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>

              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <span className="text-red-700">{errors.email.message}</span>
                )}
              </div>
            </div>
            {authType.authenticationType === "sign_up" && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>

                <div className="mt-2">
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.username && (
                    <span className="text-red-700">
                      {errors.username.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <span className="text-red-700">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {authType.submitTitle}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {authType.authenticationType === "sign_in"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              onClick={toggleAuthType}
            >
              {authType.authenticationType === "sign_in"
                ? "Sign up"
                : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
