// src\app\components\Navbar.tsx

"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useTheme } from "@/app/hooks/useTheme";
import { UserContext } from "@/app/contexts/UserContext";

type NavbarMenuItem = MenuItem & {
  label?: string;
  icon?: number | string;
};

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [searchText, setSearchText] = useState("");

  if (pathname === "/") {
    return null;
  }

  const items: NavbarMenuItem[] = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => router.push("/home"),
    },
  ];

  let authButton: React.ReactNode;
  if (user) {
    if (user.avatarUrl) {
      authButton = (
        <Avatar
          image={user.avatarUrl}
          shape="circle"
          size="large"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/profile")}
        />
      );
    } else {
      authButton = (
        <Avatar
          label={user.username.charAt(0).toUpperCase()}
          shape="circle"
          size="large"
          style={{
            cursor: "pointer",
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
          }}
          onClick={() => router.push("/profile")}
        />
      );
    }
  } else {
    authButton = (
      <Button
        icon="pi pi-user"
        rounded
        aria-label="Login"
        onClick={() => router.push("/login")}
      />
    );
  }

  const start = (
    <Link href="/" passHref>
      <p className="text-5xl font-bold hover:underline">Streamia</p>
    </Link>
  );

  const end = (
    <div className="align-items-center flex gap-2">
      <InputText
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            router.push(`/search?query=${encodeURIComponent(searchText)}`);
          }
        }}
        placeholder="Search"
        type="text"
        className="w-8rem sm:w-auto"
      />
      <Button
        icon={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
        rounded
        aria-label="Toggle theme"
        onClick={toggle}
      />
      {authButton}
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
