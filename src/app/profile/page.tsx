// src/app/profile/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  useRef,
} from "react";
import { useUser } from "@/app/hooks/useUser";
import authAxios from "@/lib/authAxios";
import { unwrapApi } from "@/utils/unwrapApi";
import type { ApiResponse } from "@/types/api-response";
import type { User } from "@/app/contexts/UserContext";
import { ToastContext } from "@/app/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";

export default function ProfilePage() {
  const { user, logout, update } = useUser();
  const showToast = useContext(ToastContext);

  const [editableUsername, setEditableUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editableEmail, setEditableEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatarUrl,
  );
  const [isDeletionDialogVisible, setIsDeletionDialogVisible] = useState(false);

  // ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => fileInputRef.current?.click();

  // initialize form when user loads
  useEffect(() => {
    if (user) {
      if (isEditingUsername) setEditableUsername(user.username);
      if (isEditingEmail) setEditableEmail(user.email);
      if (avatarFile) setAvatarPreview(user.avatarUrl);
    }
  }, [user, isEditingUsername, isEditingEmail, avatarFile]);

  if (!user) return <p className="p-4">Loading profile…</p>;

  async function saveProfile() {
    try {
      const form = new FormData();
      if (isEditingUsername) form.append("username", editableUsername);
      if (isEditingEmail) form.append("email", editableEmail);
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
      setIsEditingUsername(false);
      setIsEditingEmail(false);
      setAvatarFile(null);
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

  function confirmDeletion() {
    setIsDeletionDialogVisible(true);
  }

  async function deleteAccount() {
    try {
      await authAxios.delete("/api/users/me");
      showToast({
        severity: "success",
        summary: "Account Deleted",
        detail: "Your account has been removed.",
        life: 3000,
      });
      logout();
    } catch (err: unknown) {
      showToast({
        severity: "error",
        summary: "Deletion Failed",
        detail: err instanceof Error ? err.message : String(err),
        life: 3000,
      });
    } finally {
      setIsDeletionDialogVisible(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="group relative inline-block">
          {user.avatarUrl ? (
            <Avatar image={avatarPreview} size="xlarge" shape="circle" />
          ) : (
            <Avatar
              label={user.username.charAt(0).toUpperCase()}
              size="xlarge"
              shape="circle"
            />
          )}
          <Button
            className="bg-opacity-25 absolute inset-0 right-6 z-10 translate-x-[-110%] translate-y-[-15%] opacity-0 transition-opacity group-hover:opacity-100"
            icon="pi pi-pencil"
            onClick={triggerFileInput}
            aria-label="Edit Avatar"
            rounded
            text
            size="large"
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--text-color)",
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
      </div>

      {/* Username Field */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <label className="flex items-center gap-4 font-medium">
            Username:
            {isEditingUsername ? (
              <InputText
                value={editableUsername}
                onChange={(e) => setEditableUsername(e.target.value)}
                className="w-full"
              />
            ) : (
              <p>{user.username}</p>
            )}
          </label>
        </div>
        <div className="flex space-x-2">
          {isEditingUsername ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                text
                onClick={() => setIsEditingUsername(false)}
              />
              <Button label="Save" icon="pi pi-check" onClick={saveProfile} />
            </div>
          ) : (
            <Button
              label="Edit Username"
              icon="pi pi-pencil"
              onClick={() => setIsEditingUsername(true)}
            />
          )}
        </div>
      </div>
      <hr />

      {/* Email Field */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <label className="flex items-center gap-4 font-medium">
            Email:
            {isEditingEmail ? (
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
        <div className="flex space-x-2">
          {isEditingEmail ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                text
                onClick={() => setIsEditingEmail(false)}
              />
              <Button label="Save" icon="pi pi-check" onClick={saveProfile} />
            </div>
          ) : (
            <Button
              label="Edit Email"
              icon="pi pi-pencil"
              onClick={() => setIsEditingEmail(true)}
            />
          )}
        </div>
      </div>
      <hr />

      <div className="flex justify-end">
        <Button
          label="Delete Account"
          severity="danger"
          icon="pi pi-trash"
          onClick={confirmDeletion}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        visible={isDeletionDialogVisible}
        header="Confirm Account Deletion"
        modal
        className="w-1/3"
        onHide={() => setIsDeletionDialogVisible(false)}
      >
        <p>
          Are you sure you want to permanently delete your account? This action
          cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            label="Cancel"
            text
            onClick={() => setIsDeletionDialogVisible(false)}
          />
          <Button label="Confirm" severity="danger" onClick={deleteAccount} />
        </div>
      </Dialog>
    </div>
  );
}
