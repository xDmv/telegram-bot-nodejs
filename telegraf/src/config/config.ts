import rc from 'rc';

export type ConfigT = {
	bot_section: BotConfigT
}

export type BotConfigT = {
	bot_token: string
}

export type AdminsT = {
	admin_users: AdminsUserT
}

export type AdminsUserT = {
	id_users: string
}

export function getConfig(name: string): ConfigT {
	const config = rc(name);
	if(!config){
		throw new Error(`Config by name ${name} not found`);
	}
	return <ConfigT>config;
}

export function parserAdmins (obj: object) {
	const users_Admin = <AdminsT>obj; 
	const adminsuser : any = users_Admin.admin_users.id_users;
	let temp = adminsuser.split(', ');
	let Admins = [];
	for(let i = 0; i < temp.length; i++ ){
		Admins.push(Number(temp[i]));
	}
	return Admins;
}

export function getAdmin(name: string) {
	const config = rc(name);
	if(!config){
		throw new Error(`Config by name ${name} not found`);
	}
	return parserAdmins (config);
}
