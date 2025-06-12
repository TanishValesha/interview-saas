"use client";
import React, { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { IconUserBolt } from "@tabler/icons-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
  useClerk,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Loader, LogOut, Settings, Text, Plus, House } from "lucide-react";
import { Label } from "./ui/label";

export function SidebarDemo() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [previousModels, setPreviousModels] = useState<
    {
      id: string;
      jobTitle: string;
    }[]
  >([]);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fetchPreviousModels = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/current-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const user = await res.json();

      if (user?.data?.id) {
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
        console.log(data.data);

        if (data.success) {
          setPreviousModels(data.data);
        } else {
          console.error("Failed to fetch previous models");
        }
        setIsLoading(false);
      } else {
        setPreviousModels([]);
        setIsLoading(false);
      }
    };
    fetchPreviousModels();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar aligned to the left */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col justify-between h-screen bg-neutral-950 ">
          {open && isSignedIn && (
            <div className="flex justify-baseline items-center gap-2">
              <Button
                className="bg-transparent w-10 h-10"
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                <House className="w-10 h-10" />
              </Button>

              <Button
                className="bg-white text-black hover:bg-gray-200 flex-4"
                onClick={() => {
                  if (isSignedIn) {
                    router.push("/dashboard/interview");
                  }
                }}
              >
                <span>
                  <Plus />
                </span>
                Create
              </Button>
            </div>
          )}

          {!open && isSignedIn && (
            <>
              <Button
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => router.push("/dashboard/interview")}
              >
                <Plus />
              </Button>
            </>
          )}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mt-4 flex flex-col gap-2 text-white">
              {open && <Label className="text-white">Previous Entries</Label>}
              {isLoading ? (
                <div className="flex justify-center items-center h-screen animate-spin text-white ">
                  <Loader className="w-7 h-7" />
                </div>
              ) : previousModels.length === 0 ? (
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
                    className="text-white"
                    link={{
                      label: model.jobTitle,
                      href: `/dashboard/interview/${model.id}`,
                      icon: <Text className="h-5 w-5 shrink-0 text-white" />,
                    }}
                  />
                ))
              )}
            </div>
          </div>
          <div className="">
            <SignedOut>
              {/* Logout Icon Button */}
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

            {/* User Profile and Logout Button */}

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
                      className="ml-4 bg-transparent  hover:bg-neutral-800 text-white overflow-hidden"
                      onClick={() => setShowProfile(true)}
                    >
                      <Settings className="w-10 h-10" />
                    </Button>

                    <SignOutButton>
                      <Button
                        variant="ghost"
                        className="p-2 bg-transparent hover:text-white hover:bg-neutral-800"
                        onClick={async () => {
                          await signOut();
                          router.push("/");
                          window.location.reload();
                        }}
                      >
                        <LogOut className="w-6 h-6 text-red-400" />
                      </Button>
                    </SignOutButton>

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
