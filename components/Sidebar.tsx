import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  CreditCard,
  HelpCircle,
  LogOut,
  MessageSquarePlus,
  Plus,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar className="bg-black shadow-lg">
      <SidebarContent className="bg-black text-white">Select</SidebarContent>
    </Sidebar>
  );
}

// {/* Sidebar Container */}
// <div className="flex flex-col w-[275px] h-full border-r border-gray-800 bg-black overflow-hidden rounded-md">
//     {/* Sidebar content */}

//     {/* Logo */}
//     <div className="p-5 pb-4">
//         <div className="text-2xl font-bold">bolt</div>
//     </div>

//     {/* New Chat Button */}
//     <div className="px-4 mb-4">
//         <button className="flex items-center gap-2 bg-[#1a2734] hover:bg-[#243242] text-blue-400 rounded-md py-2 px-4 w-full transition-colors">
//             <MessageSquarePlus size={18} />
//             <span>Start new chat</span>
//         </button>
//     </div>

//     {/* Search */}
//     <div className="px-4 mb-4">
//         <div className="relative">
//             <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-[#222] border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//         </div>
//     </div>

//     {/* Chat History */}
//     <div className="flex-1 overflow-y-auto">
//         <div className="px-4 mb-2">
//             <h3 className="text-sm font-medium">Your Chats</h3>
//         </div>

//         <div className="mb-4">
//             <div className="px-4 py-1 text-xs text-gray-400">Yesterday</div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer">
//                 Create Online Auction Dashboard
//             </div>
//         </div>

//         <div className="mb-4">
//             <div className="px-4 py-1 text-xs text-gray-400">Thursday</div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer">
//                 Create Testimonial Component with Float
//             </div>
//         </div>

//         <div className="mb-4">
//             <div className="px-4 py-1 text-xs text-gray-400">
//                 Last 30 Days
//             </div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer">
//                 Authentication Form for Auction Platform
//             </div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer">
//                 Autoplay Carousel with Navigation
//             </div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer">
//                 Road Construction Progress Tracker Front
//             </div>
//         </div>

//         <div className="mb-4">
//             <div className="px-4 py-1 text-xs text-gray-400">January</div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer">
//                 Create Complaint Submission Form
//             </div>
//             <div className="px-4 py-1.5 text-sm hover:bg-[#1a2734] cursor-pointer"></div>
//                 Setting up a Complaint Management System
//             </div>
//         </div>
//     </div>

//     {/* Bottom Navigation */}
//     <div className="border-t border-gray-800">
//         <div className="p-3 flex items-center gap-2 text-sm text-green-400 hover:bg-[#1a2734] cursor-pointer">
//             <Sparkles size={18} />
//             <span>Get free tokens</span>
//         </div>
//         <div className="p-3 flex items-center gap-2 text-sm hover:bg-[#1a2734] cursor-pointer">
//             <Settings size={18} />
//             <span>Settings</span>
//         </div>
//         <div className="p-3 flex items-center gap-2 text-sm hover:bg-[#1a2734] cursor-pointer">
//             <HelpCircle size={18} />
//             <span>Help Center</span>
//         </div>
//         <div className="p-3 flex items-center gap-2 text-sm hover:bg-[#1a2734] cursor-pointer">
//             <CreditCard size={18} />
//             <span>My Subscription</span>
//         </div>
//         <div className="p-3 flex items-center gap-2 text-sm hover:bg-[#1a2734] cursor-pointer">
//             <Users size={18} />
//             <span>Select Account</span>
//         </div>
//         <div className="p-3 flex items-center gap-2 text-sm hover:bg-[#1a2734] cursor-pointer">
//             <LogOut size={18} />
//             <span>Sign Out</span>
//         </div>
//     </div>

//     {/* User Profile */}
//     <div className="p-3 border-t border-gray-800 flex items-center gap-3">
//         <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
//             T
//         </div>
//         <div>
//             <div className="text-sm font-medium">Tanish Valesha</div>
//             <div className="text-xs text-gray-400">Personal Plan</div>
//         </div>
//     </div>
// </div>
