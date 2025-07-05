"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }) => {
  const path = usePathname();
  return (
    <div>
      <Link href={href} className={path === href ? "text-purple-600" : ""}>
        {children}
      </Link>
    </div>
  );
};
export default NavLink;
