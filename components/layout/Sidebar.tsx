"use client";
import React, { ReactNode, useState } from "react";
import { Avatar, Badge } from "antd";
import { UserOutlined, BellOutlined, CarOutlined, CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

type routeProps = {
  icon: ReactNode;
  title: string;
  path: string;
};

const Sidebar = () => {
  const routeList: routeProps[] = [
    {
      icon: <Avatar shape="square" size={45} icon={<CarOutlined />} />,
      title: "首頁",
      path: "/"
    },
    {
      icon: (
        <Avatar
          shape="square"
          className="flex items-center justify-center"
          size={45}
          icon={<CarOutlined style={{ fontSize: 30 }} />}
        />
      ),
      title: "吉祥物專區",
      path: "/"
    },
    {
      icon: <Avatar shape="square" size={45} icon={<CarOutlined />} />,
      title: "可增減",
      path: "/"
    },
    {
      icon: <Avatar shape="square" size={45} icon={<CarOutlined />} />,
      title: "社群",
      path: "/"
    },
    {
      icon: <Avatar shape="square" size={45} icon={<CarOutlined />} />,
      title: "設定",
      path: "/"
    }
  ];
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  const isHidden = !showSidebar ? "hidden" : "";
  const handleRoutePath = (path: string) => {
    router.push(`${path}`);
  };
  const isLogin = false;
  if (!isLogin) {
    return <></>;
  }
  return (
    <div
      className={`  absolute left-0 z-10 grid h-screen grid-rows-6 place-items-center   bg-stone-200 p-4 ${
        showSidebar ? "w-72" : "w-20"
      }`}
    >
      {!isHidden ? (
        <CaretLeftOutlined
          style={{ fontSize: "30px" }}
          className="absolute left-60 top-1/2 z-20 float-right flex h-12 w-12 items-center justify-center  "
          onClick={() => setShowSidebar(!showSidebar)}
        />
      ) : (
        <div className="absolute left-12 top-1/2 z-10  float-right flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
          <div className="relative left-2">
            <CaretRightOutlined style={{ fontSize: "30px" }} onClick={() => setShowSidebar(!showSidebar)} />
          </div>
        </div>
      )}

      <div className="row-span-1 row-start-1 flex h-full w-full flex-shrink-0 flex-col items-center justify-between gap-4 ">
        <div className="flex w-full gap-4">
          <Badge offset={[-6, 6]} dot>
            <Avatar size={48} icon={<UserOutlined />} />
          </Badge>
          <div className={`${isHidden} flex w-full items-center justify-between `}>
            <p className="flex-1 ">使用者名稱</p>
            <BellOutlined size={25} className="hover:cursor-pointer" />
          </div>
        </div>
        <input
          placeholder="搜尋專案"
          className={`${isHidden} row-span-1 row-start-2 h-9 w-full rounded-md border-2 border-black pl-2`}
        />
      </div>

      <div className="z-10 row-span-4 row-start-2 grid h-full w-full grid-rows-6 ">
        <div className=" row-span-3 row-start-2">
          {routeList.map((route) => {
            return (
              <button
                key={route.title}
                className="mb-10 flex w-full items-center gap-4"
                onClick={() => handleRoutePath(route.path)}
              >
                {route.icon}
                <p className={isHidden}>{route.title}</p>
              </button>
            );
          })}
        </div>
      </div>
      <button className="row-span-1 row-start-6 flex h-full w-full items-end ">
        <div className="flex items-center gap-4 ">
          <Avatar shape="square" size={45} icon={<CarOutlined />} />
          <p className={isHidden}>Log out</p>
        </div>
      </button>
    </div>
  );
};

export default Sidebar;
