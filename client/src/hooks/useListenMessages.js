import { useEffect } from "react";

import { useSocketContext } from "../contexts/SocketContext";
import useConversation from "../store/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { selectedConversation, setMessages } = useConversation();

	useEffect(() => {
		const onMessage = (newMessage) => {
			if (newMessage.senderId !== selectedConversation?._id) return;
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play().catch(() => {});
			setMessages((messages) => [...messages, newMessage]);
		};

		socket?.on("newMessage", onMessage);

		return () => socket?.off("newMessage", onMessage);
	}, [socket, selectedConversation?._id, setMessages]);
};
export default useListenMessages;
