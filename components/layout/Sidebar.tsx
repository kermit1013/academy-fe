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
      icon: <Avatar shape="square" size={45} icon={<CarOutlined style={{ fontSize: 30 }} />} />,
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
      icon: <Avatar shape="square" size={45} icon={<CarOutlined style={{ fontSize: 30 }} />} />,
      title: "可增減",
      path: "/"
    },
    {
      icon: <Avatar shape="square" size={45} icon={<CarOutlined style={{ fontSize: 30 }} />} />,
      title: "社群",
      path: "/"
    },
    {
      icon: <Avatar shape="square" size={45} icon={<CarOutlined style={{ fontSize: 30 }} />} />,
      title: "設定",
      path: "/"
    }
  ];
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleRoutePath = (path: string) => {
    router.push(`${path}`);
  };

  return (
    <div
      className={`absolute left-0 z-10 h-screen  bg-stone-200 p-4  transition-all duration-500 ease-in-out ${
        showSidebar ? "w-72" : "w-20"
      }`}
    >
      <div
        className={`${
          showSidebar ? "left-60" : "left-12"
        } absolute top-1/2  flex h-12 w-12 items-center justify-end rounded-full bg-stone-200 transition-all duration-500 ease-in-out`}
      >
        {showSidebar ? (
          <CaretLeftOutlined style={{ fontSize: "30px" }} onClick={() => setShowSidebar(!showSidebar)} />
        ) : (
          <CaretRightOutlined
            className="rounded-full "
            style={{ fontSize: "30px" }}
            onClick={() => setShowSidebar(!showSidebar)}
          />
        )}
      </div>
      <div className="grid h-full w-full grid-rows-6  place-items-start overflow-hidden">
        <div className="row-span-1 row-start-1 flex h-full w-full flex-col items-start justify-between gap-4 bg-blue-300 ">
          <div
            className={`flex ${
              showSidebar ? "w-full" : "w-12"
            } items-center justify-between gap-4 overflow-hidden bg-red-300 `}
          >
            <Badge offset={[-6, 6]} dot>
              <Avatar size={48} icon={<UserOutlined />} />
            </Badge>
            <p className="flex-shrink-0 bg-blue-200">使用者名稱</p>
            <BellOutlined size={25} className="hover:animate-bounce hover:cursor-pointer" />
          </div>
          <input
            placeholder="搜尋專案"
            className={`${
              !showSidebar ? "hidden w-0" : ""
            } row-span-1 row-start-2 h-9 w-full rounded-md border-2 border-black pl-2 `}
          />
        </div>
        <div className=" z-10 row-span-4 row-start-2 grid h-full w-[95%] grid-rows-6 ">
          <div className=" row-span-3 row-start-2">
            {routeList.map((route) => {
              return (
                <button
                  key={route.title}
                  className="mb-10 flex w-full items-center gap-5 bg-red-300  transition-all delay-300 duration-500 ease-linear"
                  onClick={() => handleRoutePath(route.path)}
                >
                  <div>{route.icon}</div>
                  <p className="flex-shrink-0">{route.title}</p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="row-span-1 row-start-6 flex h-full w-full items-end bg-red-300 ">
          <button className="flex w-full items-center gap-5 ">
            <div>
              <Avatar shape="square" size={45} icon={<CarOutlined />} />
            </div>
            <p className="flex-shrink-0">Log out</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
