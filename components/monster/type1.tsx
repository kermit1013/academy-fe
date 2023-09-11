"use client";
import React, { useEffect } from "react";

const Type1 = () => {
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
    <div className="absolute -bottom-40 -left-16">
      <svg className="monster h-full w-[130%]" viewBox="0 0 173 218" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.423 185.954L158.893 195.3C168.62 195.915 175.661 186.177 172.029 177.139L104.625 9.30271C100.366 -1.30656 85.5728 -1.90127 80.4753 8.32568L1.41016 166.817C-2.82717 175.302 2.96067 185.349 12.423 185.954Z"
          fill="#EC7F49"
        />
        <path
          d="M61.4659 92.0849L100.834 95.377C109.16 96.0779 115.351 103.384 114.65 111.71C113.949 120.036 108.331 126.281 100.005 125.58C100.005 125.58 82.9499 120.578 75.5691 120.578C68.1883 120.578 57.1011 121.959 57.1011 121.959C48.7751 121.258 44.4316 114.217 45.1325 105.891C45.8228 97.5753 53.1399 91.3946 61.4659 92.0849Z"
          fill="#3A3A3A"
        />
        <path
          d="M89.906 120.578C95.8651 120.578 100.696 115.747 100.696 109.788C100.696 103.829 95.8651 98.9984 89.906 98.9984C83.947 98.9984 79.1162 103.829 79.1162 109.788C79.1162 115.747 83.947 120.578 89.906 120.578Z"
          fill="white"
        />
        <path
          d="M60.4778 118.114C66.4368 118.114 71.2676 113.283 71.2676 107.324C71.2676 101.365 66.4368 96.5344 60.4778 96.5344C54.5188 96.5344 49.688 101.365 49.688 107.324C49.688 113.283 54.5188 118.114 60.4778 118.114Z"
          fill="white"
        />
        <path
          className="monster-eye"
          d="M60.4789 112.719C63.4584 112.719 65.8738 110.304 65.8738 107.324C65.8738 104.345 63.4584 101.93 60.4789 101.93C57.4994 101.93 55.084 104.345 55.084 107.324C55.084 110.304 57.4994 112.719 60.4789 112.719Z"
          fill="#3F4040"
        />
        <path
          className="monster-eye"
          d="M89.9061 115.183C92.8857 115.183 95.301 112.768 95.301 109.788C95.301 106.809 92.8857 104.393 89.9061 104.393C86.9266 104.393 84.5112 106.809 84.5112 109.788C84.5112 112.768 86.9266 115.183 89.9061 115.183Z"
          fill="#3F4040"
        />
        <path
          d="M60.4139 213.3C57.4298 213.3 55.019 210.879 55.019 207.905V185.115C55.019 182.131 57.4404 179.72 60.4139 179.72C63.3981 179.72 65.8089 182.141 65.8089 185.115V207.905C65.8195 210.879 63.3981 213.3 60.4139 213.3Z"
          fill="#EC7F49"
        />
        <path
          d="M116.976 213.3C113.992 213.3 111.582 210.879 111.582 207.905V185.115C111.582 182.131 114.003 179.72 116.976 179.72C119.961 179.72 122.371 182.141 122.371 185.115V207.905C122.371 210.879 119.961 213.3 116.976 213.3Z"
          fill="#EC7F49"
        />
        <path
          className="monster-eye"
          d="M63.8341 217.899H42.1589C41.065 217.899 40.1836 217.017 40.1836 215.923V215.201C40.1836 210.73 43.805 207.098 48.2866 207.098H65.8306V215.913C65.82 217.007 64.9279 217.899 63.8341 217.899Z"
          fill="#EC7F49"
        />
        <path
          className="monster-eye"
          d="M120.395 217.899H98.7199C97.6261 217.899 96.7446 217.017 96.7446 215.923V215.201C96.7446 210.73 100.366 207.098 104.848 207.098H122.392V215.913C122.37 217.007 121.489 217.899 120.395 217.899Z"
          fill="#EC7F49"
        />
      </svg>
    </div>
  );
};

export default Type1;
