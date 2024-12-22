import { BarChart, People, Settings, Menu } from "@mui/icons-material";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: BarChart,
    color: "#ECF0F1", // Updated to Light Gray
    href: "/",
  },
  {
    name: "Branch",
    icon: People,
    color: "#ECF0F1", // Updated to Light Gray
    href: "/branch",
  },
  {
    name: "Student",
    icon: People,
    color: "#ECF0F1", // Updated to Light Gray
    href: "/student",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#ECF0F1", // Updated to Light Gray
    href: "/settings",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-[#34495E] p-4 flex flex-col border-r border-[#2C3E50]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-[#2C3E50] transition-colors max-w-fit"
        >
          <Menu style={{ fontSize: 24, color: "#FFFFFF" }} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#2C3E50] transition-colors mb-2">
                <item.icon
                  style={{ color: item.color, fontSize: 20, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 text-[#FFFFFF] whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
