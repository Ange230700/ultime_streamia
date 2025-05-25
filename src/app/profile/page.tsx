// src/app/profile/page.tsx
"use client";

import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import { useUser } from "@/app/hooks/useUser";
import authAxios from "@/lib/authAxios";
import { unwrapApi } from "@/utils/unwrapApi";
import type { ApiResponse } from "@/types/api-response";
import type { User } from "@/app/contexts/UserContext";
import { ToastContext } from "@/app/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

export default function ProfilePage() {
  const { user, logout, update } = useUser();
  const showToast = useContext(ToastContext);

  const [editableEmail, setEditableEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatarUrl,
  );

  // initialize form when user loads
  useEffect(() => {
    if (user) {
      setEditableEmail(user.email);
      setAvatarPreview(user.avatarUrl);
    }
  }, [user]);

  if (!user) return <p className="p-4">Loading profile…</p>;

  async function saveProfile() {
    try {
      const form = new FormData();
      form.append("email", editableEmail);
      if (avatarFile) form.append("avatar", avatarFile);
      // you’ll need to implement this endpoint:
      const res = await authAxios.put<ApiResponse<User>>(
        "/api/users/me",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const updatedUser = unwrapApi(res.data);
      update(updatedUser);
      showToast({
        severity: "success",
        summary: "Profile Saved",
        detail: "Your changes have been saved.",
      });
      setIsEditing(false);
    } catch (err: unknown) {
      showToast({
        severity: "error",
        summary: "Save Failed",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  function onAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            image={avatarPreview}
            size="xlarge"
            shape="circle"
            style={{ cursor: isEditing ? "pointer" : "default" }}
            onClick={
              isEditing
                ? () => document.getElementById("avatar")?.click()
                : undefined
            }
          />
          {isEditing && (
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          )}
        </div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">
          Email
          {isEditing ? (
            <InputText
              value={editableEmail}
              onChange={(e) => setEditableEmail(e.target.value)}
              className="w-full"
            />
          ) : (
            <p>{user.email}</p>
          )}
        </label>
      </div>

      <div className="flex justify-between">
        {isEditing ? (
          <>
            <Button
              label="Cancel"
              text
              onClick={() => {
                setIsEditing(false);
                setEditableEmail(user.email);
                setAvatarPreview(user.avatarUrl);
                setAvatarFile(null);
              }}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveProfile} />
          </>
        ) : (
          <Button
            label="Edit Profile"
            icon="pi pi-pencil"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>

      <hr />

      <Button
        label="Log Out"
        severity="danger"
        icon="pi pi-sign-out"
        onClick={() => logout()}
      />
    </div>
  );
}
