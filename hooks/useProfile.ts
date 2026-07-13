"use client";

import { useState, useEffect, useCallback } from "react";
import UserService from "@/services/user.service";
import { decodeJWT } from "@/lib/jwt";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface ProfileState {
  _id: string;
  fullName: string;
  title: string;
  nip: string;
  username: string;
  role: string;
  grade: string;
  image_url?: string;
  image_id?: string;
}

export function useProfile(userId?: string) {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      if (userId) {
        const res = await UserService.getAll();
        const users = res.result || [];
        const found = users.find((u) => u._id === userId);
        if (found) {
          setProfile(found);
          if (token) {
            const payload = decodeJWT(token);
            setIsSelf(payload?.user === found.username);
          }
        } else {
          toast.error("Pengguna tidak ditemukan");
        }
      } else {
        const res = await UserService.getMe();
        const data = res.result as unknown as ProfileState;
        setProfile(data);
        setIsSelf(true);
      }
    } catch {
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (formData: FormData) => {
    const id = profile?._id;
    if (!id) return;

    setSaving(true);
    try {
      const res = await UserService.updateProfile(id, formData);
      const { token: newToken, user } = res.result!;

      sessionStorage.setItem("user_session", newToken);
      document.cookie = `user_session=${encodeURIComponent(newToken)}; path=/; max-age=86400`;

      const payload = decodeJWT(newToken);
      if (payload) {
        sessionStorage.setItem("user_fullName", payload.fullName || "");
        document.cookie = `user_fullName=${encodeURIComponent(payload.fullName || "")}; path=/; max-age=86400`;
      }

      window.dispatchEvent(new Event("auth-update"));

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              fullName: user.fullName,
              title: user.title,
              nip: user.nip,
              username: user.username,
              image_url: user.image_url,
              image_id: user.image_id,
            }
          : prev,
      );

      toast.success("Profil berhasil diperbarui");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, isSelf, updateProfile, refetch: fetchProfile };
}
