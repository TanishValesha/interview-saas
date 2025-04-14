"use client";
import React, { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
  Circle,
  Dot,
  Loader,
  Notebook,
  NotepadTextDashed,
  Settings,
  Text,
} from "lucide-react";
import { apiUrl } from "./libs/apiUrl";
import { Label } from "./ui/label";
// import Image from "next/image";

export function SidebarDemo() {
  const [open, setOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [previousModels, setPreviousModels] = useState<
    {
      id: string;
      jobTitle: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchPreviousModels = async () => {
      const res = await fetch(`${apiUrl}/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user = await res.json();
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.data?.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPreviousModels(data.data);
      } else {
        console.error("Failed to fetch previous models");
      }
    };
    fetchPreviousModels();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar aligned to the left */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col justify-between h-full bg-neutral-950">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mt-8 flex flex-col gap-2 text-white">
              {open && <Label className="text-white">Previous Entries</Label>}
              {previousModels.length === 0 ? (
                <div
                  className={`flex items-center justify-center h-screen text-white ${
                    !open ? "hidden" : ""
                  }`}
                >
                  <Label className="text-white">No Previous Entries</Label>
                </div>
              ) : (
                previousModels.map((model, idx) => (
                  <SidebarLink
                    key={idx}
                    link={{
                      label: model.jobTitle,
                      href: `/interview/${model.id}`,
                      icon: (
                        <Text className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                      ),
                    }}
                  />
                ))
              )}
            </div>
          </div>
          <div className="">
            <SignedOut>
              <SignInButton mode="modal">
                {open ? (
                  <Button className="w-full px-4 py-2 text-white text-sm">
                    Sign In
                  </Button>
                ) : (
                  <Button className="p-2 w-full text-white text-sm">
                    {/* Just an icon when collapsed */}
                    <IconUserBolt className="w-5 h-5 mx-auto" />
                  </Button>
                )}
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center justify-center text-white">
                {open ? (
                  <div className="overflow-hidden">
                    <UserButton
                      afterSignOutUrl="/"
                      showName={true}
                      appearance={{
                        baseTheme: dark,
                        variables: {
                          colorText: "white",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                    <Button
                      className="ml-4 bg-transparent hover:bg-neutral-800 text-white overflow-hidden"
                      onClick={() => setShowProfile(true)}
                    >
                      <Settings className="w-10 h-10" />
                    </Button>

                    {showProfile && (
                      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                        <div className="relative">
                          <UserProfile
                            routing="hash"
                            appearance={{
                              baseTheme: dark,
                              elements: {
                                card: "bg-neutral-900 text-white",
                              },
                            }}
                          />
                          <Button
                            className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700"
                            onClick={() => setShowProfile(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      baseTheme: dark,
                      elements: {
                        userButtonAvatarBox: "w-10 h-10",
                      },
                    }}
                  />
                )}
              </div>
            </SignedIn>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

// export const Logo = () => {
//   return (
//     <Link
//       href="#"
//       className="flex items-center space-x-2 py-2 text-sm font-normal text-black"
//     >
//       <div className="h-5 w-6 rounded-lg bg-black dark:bg-white" />
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="font-medium text-black dark:text-white"
//       >
//         Acet Labs
//       </motion.span>
//     </Link>
//   );
// };

// export const LogoIcon = () => {
//   return (
//     <Link href="#" className="flex items-center py-2">
//       <div className="h-5 w-6 rounded-lg bg-black dark:bg-white" />
//     </Link>
//   );
// };
