import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
			const nextSocket = io(socketUrl, {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(nextSocket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			nextSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => {
				nextSocket.close();
				setSocket(null);
			};
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
