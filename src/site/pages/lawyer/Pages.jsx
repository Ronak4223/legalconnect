import { useTitle } from "../../hooks.js";
import CasesView from "../shared/CasesView.jsx";
import MessagesView from "../shared/MessagesView.jsx";
import NotificationsView from "../shared/NotificationsView.jsx";

export const LawyerCases = () => { useTitle("Cases"); return (<><div className="ph"><div><h1>Case management</h1><p>Move matters through stages, keep notes and track deadlines.</p></div></div><CasesView role="lawyer" /></>); };
export const LawyerMessages = () => { useTitle("Messages"); return (<><div className="ph"><div><h1>Messages</h1><p>Secure conversations with your clients.</p></div></div><MessagesView role="lawyer" /></>); };
export const LawyerNotifications = () => { useTitle("Notifications"); return (<><div className="ph"><div><h1>Notifications</h1><p>Requests, messages, payments and case activity.</p></div></div><NotificationsView /></>); };
