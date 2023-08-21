import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <main>{children}</main>
  </div>
);

export default AuthLayout;
