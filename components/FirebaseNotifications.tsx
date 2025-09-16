"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { refreshFirebaseToken } from "@/store/account/accountThunks";
import { listenToMessages, requestFirebaseToken } from "@/lib/firebase";

export default function FirebaseNotifications() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      const token = await requestFirebaseToken();
      if (token) {
        dispatch(refreshFirebaseToken(token));
      }
      listenToMessages();
    };
    init();
  }, [dispatch]);

  return null;
}
