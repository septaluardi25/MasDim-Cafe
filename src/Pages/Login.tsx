import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/auth.schema";
import type { LoginRequest } from "../types/Auth";
import { authLogin } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const loginAction = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: authLogin,
    onSuccess: ({ token, user }) => {
      loginAction(token, user);
      navigate("/");
    },
  });
  const onSubmit = (data: LoginRequest) => {
    setError("");
    loginMutation.mutate(data);
  };
  return (
    <div className="bg-gray-800 min-h-screen w-full flex justify-center items-center">
      <div className=" max-w-xl min-w-md min-h-80 ">
        <form
          className="flex justify-between flex-col  p-5 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="items-center text-center font-bold text-4xl text-gray-200">
            Login
          </h1>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded">
              {error}
            </p>
          )}
          <label
            className="text-md font-semibold text-gray-200"
            htmlFor="email"
          >
            Email :
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="bg-gray-700 text-gray-200 font-semibold px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-amber-500"
          />
          <div className="h-6">
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>
          <label
            className="text-md font-semibold text-gray-200"
            htmlFor="password"
          >
            Password :
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="bg-gray-700 text-gray-200 font-semibold px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-amber-500"
          />
          <div className="h-6 mb-5">
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className=" bg-amber-100 py-2 px-4 rounded-md font-semibold text-gray-800 cursor-pointer focus:outline-none hover:bg-amber-200 transition duration-200 border-none"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Loading.." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
