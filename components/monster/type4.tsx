"use client";
import React, { useEffect } from "react";

const Type4 = () => {
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
    <div className="absolute -bottom-36 -left-16">
      <svg className="monster h-full w-[130%]" viewBox="0 0 142 159" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M116.88 0.0400391H68.1297C31.0197 0.0400391 0.929688 30.12 0.929688 67.24V143.56C0.929688 151.77 7.5897 158.43 15.7997 158.43H16.6097C20.9897 158.43 24.5497 154.87 24.5497 150.49V148.46C24.5497 145.15 25.8897 142.16 28.0597 139.99C30.2297 137.82 33.2197 136.48 36.5297 136.48C38.3997 136.48 39.9197 137.99 39.9197 139.86V150.05C39.9197 152.36 40.8597 154.46 42.3697 155.98C43.8897 157.49 45.9897 158.43 48.2997 158.43C52.7797 158.43 56.4097 154.8 56.4097 150.32V134.85C56.4097 133.06 57.1297 131.45 58.2997 130.28C59.4697 129.11 61.0897 128.39 62.8697 128.39C67.3397 128.39 70.9697 132.02 70.9697 136.49V146.55C70.9697 149.83 72.2997 152.8 74.4497 154.95C76.5997 157.1 79.5697 158.43 82.8497 158.43C85.8297 158.43 88.2597 156 88.2597 153.01V148.1C88.2597 145.05 90.7297 142.58 93.7797 142.58H95.6597C97.6797 142.58 99.3197 144.22 99.3197 146.24V153.79C99.3197 155.07 99.8397 156.23 100.68 157.07C101.52 157.91 102.68 158.43 103.96 158.43C124.42 158.43 141.01 141.84 141.01 121.38V24.17C141.01 10.84 130.2 0.0400391 116.88 0.0400391ZM124.49 36.03C124.49 45.45 116.85 53.09 107.43 53.09H63.7297C54.3097 53.09 46.6697 45.45 46.6697 36.03V32.88C46.6697 23.46 54.3097 15.82 63.7297 15.82H107.43C116.85 15.82 124.49 23.46 124.49 32.88V36.03Z"
          fill="#30A549"
        />
        <path
          d="M69.2304 49.57C77.5809 49.57 84.3504 42.8005 84.3504 34.45C84.3504 26.0994 77.5809 19.33 69.2304 19.33C60.8798 19.33 54.1104 26.0994 54.1104 34.45C54.1104 42.8005 60.8798 49.57 69.2304 49.57Z"
          fill="#27763B"
        />
        <path
          d="M70.1502 45.42C76.2087 45.42 81.1202 40.5085 81.1202 34.45C81.1202 28.3914 76.2087 23.48 70.1502 23.48C64.0916 23.48 59.1802 28.3914 59.1802 34.45C59.1802 40.5085 64.0916 45.42 70.1502 45.42Z"
          fill="#3A3A3A"
        />
        <path
          className="monster-eye"
          d="M69.2299 39.05C71.7704 39.05 73.8299 36.9905 73.8299 34.45C73.8299 31.9095 71.7704 29.85 69.2299 29.85C66.6894 29.85 64.6299 31.9095 64.6299 34.45C64.6299 36.9905 66.6894 39.05 69.2299 39.05Z"
          fill="white"
        />
        <path
          d="M105.75 49.57C114.1 49.57 120.87 42.8005 120.87 34.45C120.87 26.0994 114.1 19.33 105.75 19.33C97.3993 19.33 90.6299 26.0994 90.6299 34.45C90.6299 42.8005 97.3993 49.57 105.75 49.57Z"
          fill="#27763B"
        />
        <path
          d="M103.88 45.42C109.939 45.42 114.85 40.5085 114.85 34.45C114.85 28.3914 109.939 23.48 103.88 23.48C97.8216 23.48 92.9102 28.3914 92.9102 34.45C92.9102 40.5085 97.8216 45.42 103.88 45.42Z"
          fill="#3A3A3A"
        />
        <path
          className="monster-eye"
          d="M102.96 39.05C105.5 39.05 107.56 36.9905 107.56 34.45C107.56 31.9095 105.5 29.85 102.96 29.85C100.419 29.85 98.3599 31.9095 98.3599 34.45C98.3599 36.9905 100.419 39.05 102.96 39.05Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default Type4;
