"use client";
import React from "react";
import Image from "next/image";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/navigation";

const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`);
};

const Login = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <div className="md:flex md:justify-between">
      <div className="relative h-screen w-full md:static md:w-2/3 lg:w-3/4">
        <Image width={900} height={900} className="h-full w-full " alt="NextUI hero Image" src="/bg_login.jpeg" />
      </div>
      <div className="absolute top-0 flex h-screen w-full  flex-col items-center  justify-between p-8 md:static md:w-1/3 lg:w-1/4">
        <div className="flex flex-col items-center gap-8">
          <div className="h-[92px] w-[92px] rounded-2xl bg-gray-300"></div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-bold md:text-3xl lg:text-[45px]">WebSite Name</p>
            <p className="md:text-xl lg:text-[25px]">標題/口號</p>
          </div>
        </div>
        <div className="flex h-fit w-full max-w-[350px] flex-col gap-4 ">
          <div className="flex w-full flex-col gap-16">
            <div className=" w-full">
              <p className="lg:text-lg">Email</p>
              <input className="w-full border-b-2 border-black hover:border-red-400  focus:outline-none" />
            </div>
            <div className=" w-full">
              <p className="lg:text-lg">Password</p>
              <input className="w-full border-b-2 border-black hover:border-red-400  focus:outline-none" />
            </div>
          </div>
          <span className="flex w-full items-center justify-between text-xs lg:text-base">
            <Checkbox onChange={onChange}>Remember Me</Checkbox>
            <a className="text-gray-300 hover:text-gray-400 hover:underline" href="">
              Forgot Password?
            </a>
          </span>
        </div>

        <div className="flex w-full max-w-[350px]  flex-col gap-4">
          <button
            className="h-12 w-full rounded-full bg-black text-white hover:ring-2 hover:ring-red-400"
            onClick={handleLogin}
          >
            Log In
          </button>
          <button className="h-12 w-full rounded-full bg-gray-300 hover:ring-2 hover:ring-red-400">
            Log in with Google
          </button>
        </div>

        <div className="md:text-xs lg:text-base">
          <span className="text-gray-300">Don&apos;t have an account? </span>
          <a className="hover:underline" href="">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
