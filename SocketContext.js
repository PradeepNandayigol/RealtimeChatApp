import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser, userId } = useContext(AuthContext);

  useEffect(() => {
    if (authUser && userId) {
      const newSocket = io("http://localhost:6000", {
        query: {
          userId: userId,
        },
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, userId]); // Add dependencies here

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
