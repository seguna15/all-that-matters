import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";


import Header from "../../components/common/Header";
import UsersTable from "./components/UsersTable";

import { useUsersStore } from "../../../../store/usersStore";
import { useEffect } from "react";


const UsersPage = () => {
	const {users, fetchAllUsers} = useUsersStore();

	useEffect(() => {
		fetchAllUsers()
	},[fetchAllUsers])


	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Users' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				

				<UsersTable />

				
			</main>
		</div>
	);
};
export default UsersPage;
