

export const  HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/auth";
export const SIGNUPROUTES = `${AUTH_ROUTES}/signup`;
export const LOGINROUTES = `${AUTH_ROUTES}/login`;
export const GETUSERINFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATEPROFILE = `${AUTH_ROUTES}/update-profile`;
export const ADDPROFILEIMAGE = `${AUTH_ROUTES}/addprofileimage`;
export const REMOVEPROFILEIMAGE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUTURL = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "/api/contacts";
export const SEARCH_CONTACT_ROUTES = `${CONTACTS_ROUTES}/search`