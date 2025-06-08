import React from "react";
import { Badge } from "./ui/badge";

const Logo = ({ badge }: { badge?: string }) => {
  return (
    <div className="flex items-center gap-2">
      <img src={"/logo.png"} alt="Dotenvx Logo" className="w-[35px]" />
      <span className="text-xl font-bold ">Dotenvx</span>
      {badge && (
        <Badge
          variant="secondary"
          className="ml-2 bg-gradient-to-r from-primary/10 to-purple-600/10"
        >
          {badge}
        </Badge>
      )}
    </div>
  );
};

export default Logo;
