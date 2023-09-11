"use client";
import React, { useEffect } from "react";

const Type3 = () => {
  useEffect(() => {
    const monsterEyes = document.querySelectorAll(".journeyCard") as NodeListOf<HTMLElement>;

    monsterEyes.forEach((eye) => {
      eye.addEventListener("mousemove", (e: MouseEventInit) => {
        const itemRect = eye.getBoundingClientRect();
        let calsX = e.clientX! - itemRect.left - itemRect.width / 2;
        let calsY = e.clientY! - itemRect.top - itemRect.height / 2;
        calsX = calsX < -55 ? -55 : calsX > 100 ? 100 : calsX;
        calsY = calsY < -94 ? -94 : calsY > 22 ? 22 : calsY;
        eye.style.setProperty("--x", `${calsX * 0.1}px`);
        eye.style.setProperty("--y", `${calsY * 0.1}px`);
      });
      eye.addEventListener("mouseout", () => {
        eye.style.setProperty("--x", `${0}px`);
        eye.style.setProperty("--y", `${0}px`);
      });
    });
  }, []);

  return (
    <div className="absolute -bottom-28 -left-16">
      <svg className="monster h-full w-[130%]" viewBox="0 0 182 191" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M86.8302 27.5001H53.1201C51.3201 27.5001 49.8702 25.9601 50.0302 24.1701C51.2702 11.0601 59.7202 0.930054 69.9802 0.930054C80.2202 0.930054 88.6701 11.0601 89.9101 24.1701C90.0801 25.9601 88.6202 27.5001 86.8302 27.5001Z"
          fill="#2F66B0"
        />
        <path
          d="M132.46 29.05H98.7501C96.9501 29.05 95.5 27.51 95.66 25.72C96.9 12.61 105.35 2.47998 115.61 2.47998C125.85 2.47998 134.3 12.61 135.54 25.72C135.72 27.51 134.26 29.05 132.46 29.05Z"
          fill="#2F66B0"
        />
        <path
          d="M92.6501 17.36C145.98 17.36 181.87 54.12 181.87 95.29C181.87 136.46 145.98 169.83 92.6501 169.83C39.3201 169.83 0.0400391 136.46 0.0400391 95.29C0.0400391 54.12 39.3101 17.36 92.6501 17.36Z"
          fill="#2F66B0"
        />
        <path
          d="M82.1798 25.39H57.7599C56.4599 25.39 55.3999 24.28 55.5299 22.98C56.4299 13.49 62.5499 6.15002 69.9799 6.15002C77.3999 6.15002 83.5198 13.49 84.4198 22.98C84.5398 24.27 83.4798 25.39 82.1798 25.39Z"
          fill="#3F4040"
        />
        <path
          d="M127.64 25.39H103.22C101.92 25.39 100.86 24.28 100.99 22.98C101.89 13.49 108.01 6.15002 115.44 6.15002C122.86 6.15002 128.98 13.49 129.88 22.98C129.99 24.27 128.94 25.39 127.64 25.39Z"
          fill="#3F4040"
        />
        <path
          className="monster-eye"
          d="M73.3999 23.05H58.8398C58.8398 19.03 62.0998 15.77 66.1198 15.77C70.1398 15.76 73.3999 19.02 73.3999 23.05Z"
          fill="white"
        />
        <path
          className="monster-eye"
          d="M121.26 23.05H106.7C106.7 19.03 109.96 15.77 113.98 15.77C118 15.76 121.26 19.02 121.26 23.05Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default Type3;
