import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import useGetConversations from "../../../hooks/useGetConversations";

const Sidebar = () => {
	const { conversations, loading } = useGetConversations();

	return (
		<div className='border-r border-slate-500 p-4 flex flex-col'>
			<SearchInput conversations={conversations} />
			<div className='divider px-3'></div>
			<Conversations conversations={conversations} loading={loading} />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;


