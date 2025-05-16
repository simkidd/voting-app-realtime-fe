import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

interface SocketContextType {
  socket: Socket | null;
  subscribeToPosition: (positionId: string) => void;
  unsubscribeFromPosition: (positionId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  subscribeToPosition: () => {},
  unsubscribeFromPosition: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = Cookies.get("vote_token");

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(import.meta.env.VITE_API_BASE_URL || "", {
      withCredentials: true,
      autoConnect: true,
      auth: {
        token,
      },
    });

    socketInstance.connect();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const subscribeToPosition = (positionId: string) => {
    if (socket) {
      socket.emit("subscribe", positionId);
    }
  };

  const unsubscribeFromPosition = (positionId: string) => {
    if (socket) {
      socket.emit("unsubscribe", positionId);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, subscribeToPosition, unsubscribeFromPosition }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
