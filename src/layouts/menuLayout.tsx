
import { Outlet } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import StaggeredMenu from "@/components/StaggeredMenu";
import logo from '../assets/logo.png'
export default function MenuLayout() {
  const { role } = useAuth();
    
  const menuItems = [
    { label: "Dashboard", ariaLabel: "Back to dashboard", link: `/Dashboard/${role}` },
    { label: "Projects", ariaLabel: "Go to home page", link: "/Dashboard/Projects" },
    { label: "Managers", ariaLabel: "Learn about us", link: "/Dashboard/Managers" },
    { label: "Workers", ariaLabel: "View our services", link: "/Dashboard/Workers" },
    { label: "Clients", ariaLabel: "Get in touch", link: "/Dashboard/Clients" },
    { label: "Messages", ariaLabel: "Get in touch", link: "/Dashboard/Messages" },
  ];

  const socialItems = [{ label: "Twitter", link: "/" }];

  return (
    <>
      <StaggeredMenu
        isFixed
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="033363"
        openMenuButtonColor="#1a1a1a"
        changeMenuColorOnOpen={true}
        colors={["033363", "#5227FF"]}
        logoUrl={logo}
        accentColor="#5227FF"
      />
      <Outlet />
    </>
  );
}