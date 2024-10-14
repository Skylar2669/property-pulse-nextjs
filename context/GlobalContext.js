"use client";
// send unreadCount and setUnreadCount to every component
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";

//Create Context
const GlobalContext = createContext();

//Create Provider
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (res.count) setUnreadCount(res.count);
      });
    }
  }, [getUnreadMessageCount, session]);

  return (
    <GlobalContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {/* the children here will be the entire app */}
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
