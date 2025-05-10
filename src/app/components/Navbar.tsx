// src\app\components\Navbar.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";

type NavbarMenuItem = MenuItem & {
  label?: string;
  icon?: number | string;
};

export default function Navbar() {
  const items: NavbarMenuItem[] = [
    // {
    //   label: "Home",
    //   icon: "pi pi-home",
    // },
  ];

  const start = (
    <Link href="/" passHref>
      <p className="text-5xl hover:underline">Streamia</p>
    </Link>
  );
  const end = (
    <div className="align-items-center flex gap-2">
      <InputText
        placeholder="Search"
        type="text"
        className="w-8rem sm:w-auto"
      />
      <Button icon="pi pi-user" rounded aria-label="User" />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
