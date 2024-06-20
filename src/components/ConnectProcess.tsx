import React from 'react';

interface ConnectProcessProps {
  status: boolean;
}

const ConnectProcess: React.FC<ConnectProcessProps> = ({ status }) => {
  return status ? (
    <div className="w-screen h-screen bg-[url('/public/CoralBG.webp')] relative flex justify-center items-center z-50">
      <div className="w-[946px] h-[91px] rounded-full border-2 border-white text-white flex gap-4 justify-center items-center text-2xl font-bold">
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.16671 43.544H4.58337C4.58337 35.95 10.7395 29.794 18.3334 29.794C25.9273 29.794 32.0834 35.95 32.0834 43.544H27.5C27.5 38.4813 23.396 34.3773 18.3334 34.3773C13.2708 34.3773 9.16671 38.4813 9.16671 43.544ZM42.0842 35.2092L38.8438 31.9688C41.8525 28.9603 43.5429 24.8798 43.5429 20.625C43.5429 16.3702 41.8525 12.2897 38.8438 9.28125L42.0842 6.04083C50.1374 14.0952 50.1374 27.1526 42.0842 35.2069V35.2092ZM35.6011 28.7283L32.3607 25.4833C35.0415 22.7992 35.0415 18.4508 32.3607 15.7667L35.6011 12.5194C40.0757 16.9941 40.0757 24.249 35.6011 28.7238V28.7283ZM18.3334 27.5C13.2708 27.5 9.16671 23.3959 9.16671 18.3333C9.16671 13.2707 13.2708 9.16667 18.3334 9.16667C23.396 9.16667 27.5 13.2707 27.5 18.3333C27.5 20.7645 26.5343 23.0961 24.8152 24.8151C23.0961 26.5342 20.7645 27.5 18.3334 27.5ZM18.3334 13.75C15.8295 13.7525 13.791 15.764 13.7552 18.2677C13.7193 20.7713 15.6993 22.8404 18.202 22.9146C20.7048 22.9889 22.804 21.0409 22.9167 18.5396V19.4563V18.3333C22.9167 15.802 20.8647 13.75 18.3334 13.75Z"
            fill="white"
          />
        </svg>

        <p>連線中...</p>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ConnectProcess;