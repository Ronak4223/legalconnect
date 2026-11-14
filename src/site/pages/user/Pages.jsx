import { useTitle } from "../../hooks.js";
import CasesView from "../shared/CasesView.jsx";
import MessagesView from "../shared/MessagesView.jsx";
import NotificationsView from "../shared/NotificationsView.jsx";

export const UserCases = () => { useTitle("My cases"); return (<><div className="ph"><div><h1>My cases</h1><p>Track progress, key dates, documents and notes for every matter.</p></div></div><CasesView role="user" /></>); };
export const UserMessages = () => { useTitle("Messages"); return (<><div className="ph"><div><h1>Messages</h1><p>Private conversations with your lawyers.</p></div></div><MessagesView role="user" /></>); };
export const UserNotifications = () => { useTitle("Notifications"); return (<><div className="ph"><div><h1>Notifications</h1><p>Appointment updates, lawyer replies and case changes.</p></div></div><NotificationsView /></>); };
