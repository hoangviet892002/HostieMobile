import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stores";
import { coreURL } from "@/utils/endPoint";

interface SocketContextType {
  socket: Socket | null;
}
const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const id = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (id) {
      socketRef.current = io(coreURL, {
        query: {
          userId: id,
        },
      });
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
