// src\app\components\Navbar.tsx

"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
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
  const { user, logout } = useContext(UserContext);
  const [adminView, setAdminView] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  // Debounce and navigate on searchText change
  useEffect(() => {
    if (searchText.trim() === "") return;
    const timeout = setTimeout(() => {
      router.push(`/search?query=${encodeURIComponent(searchText)}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText, router]);

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

  // Conditionally append Admin‐only items
  if (user?.is_admin && adminView) {
    items.push(
      {
        label: "Admin Dashboard",
        icon: "pi pi-shield",
        command: () => router.push("/admin/dashboard"),
      },
      {
        label: "User Management",
        icon: "pi pi-users",
        command: () => router.push("/admin/users"),
      },
      {
        label: "Content Review",
        icon: "pi pi-eye",
        command: () => router.push("/admin/content"),
      },
    );
  }

  let authControls: React.ReactNode;
  if (user) {
    const avatar = user.avatarUrl ? (
      <Avatar
        image={user.avatarUrl}
        shape="circle"
        size="large"
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/profile")}
      />
    ) : (
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

    authControls = (
      <div className="flex items-center gap-2">
        {avatar}
        <Button
          icon="pi pi-sign-out"
          rounded
          aria-label="Logout"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        />
      </div>
    );
  } else {
    authControls = (
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

      {/* Admin View toggle (only for admins) */}
      {user?.is_admin && (
        <div className="flex items-center gap-2">
          <span className="font-medium">Admin View</span>
          <InputSwitch
            checked={adminView}
            onChange={(e: InputSwitchChangeEvent) => setAdminView(e.value)}
          />
        </div>
      )}

      {/* Login / Logout */}
      {authControls}
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
