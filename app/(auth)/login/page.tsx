"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/navigation";
import { GoogleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import bgLogin from "../../../public/bg_login.svg";
import iconLogin from "../../../public/icon_login.svg";
import { authApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`);
};

const Login = () => {
  const router = useRouter();
  router.push("/start");
  return;

  const { mutateAsync: login, isLoading } = useMutation(authApi.login, {
    onSuccess: () => {}
  });

  useEffect(() => {
    login({
      username: "chia",
      password: "1234"
    }).then((data) => {
      console.log(data);
    });
  }, []);

  const handleLogin = () => {
    router.push("/");
  };
  const getSocialLoginUrl = (name: string) => {
    return `${dev.url.API_BASE_URL}/oauth2/authorization/${name}?redirect_uri=${dev.url.OAUTH2_REDIRECT_URI}`;
  };

  const dev = {
    url: {
      API_BASE_URL: "http://192.168.68.102.nip.io:8000/v1",
      OAUTH2_REDIRECT_URI: "http://localhost:3000/oauth2/redirect"
    }
  };

  return (
    <div className="flex items-center justify-center   md:justify-between">
      <div className="relative flex h-screen w-full items-center justify-center bg-[#E3CEFE] md:static md:w-2/3 lg:w-3/4">
        <Image src={bgLogin} alt="" />
      </div>
      <div className="absolute flex h-[80%] w-[80%] flex-col items-center  justify-between rounded-2xl  bg-white/70 p-8 backdrop-blur-sm md:static md:top-0 md:h-screen md:w-1/3 md:bg-stone-100 ">
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-[92px] w-[92px] overflow-hidden rounded-2xl bg-[#3F4040]">
            <Image className=" absolute -bottom-2" src={iconLogin} alt="" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className=" text-3xl  font-bold lg:text-4xl ">WebSite Name</p>
            <p className="md:text-xl lg:text-2xl">標題/口號</p>
          </div>
        </div>
        <div className="flex h-fit w-full max-w-[350px] flex-col gap-4 ">
          <div className="flex w-full flex-col gap-16">
            <div className=" w-full">
              <p className="lg:text-lg">帳號</p>
              <input className="w-full border-b-2 border-black bg-transparent  hover:border-red-400 focus:outline-none" />
            </div>
            <div className=" w-full">
              <p className="lg:text-lg">密碼</p>
              <input className="w-full border-b-2 border-black bg-transparent  hover:border-red-400 focus:outline-none" />
            </div>
          </div>
          <span className="flex w-full items-center justify-between text-xs lg:text-base">
            <Checkbox onChange={onChange}>記住我</Checkbox>
            <a className="text-stone-400 hover:text-stone-500 hover:underline" href="">
              忘記密碼
            </a>
          </span>
        </div>

        <div className="flex w-full max-w-[350px]  flex-col gap-4">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black text-white hover:bg-black/80"
            onClick={handleLogin}
          >
            <p>登入</p>
            <ArrowRightOutlined />
          </button>
          <a
            href={getSocialLoginUrl("google")}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border-2 border-black hover:bg-stone-200"
          >
            <GoogleOutlined />
            <p>透過Google登入</p>
          </a>
        </div>

        <div className="md:text-xs lg:text-base">
          <span className="text-stone-300">尚未擁有帳號? </span>
          <a className="ml-2 hover:underline" href="">
            註冊
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
