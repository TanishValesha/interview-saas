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
import {
  Loader,
  LogOut,
  Settings,
  Text,
  Plus,
  House,
  Menu,
  X,
} from "lucide-react";
import { Label } from "./ui/label";

export function SidebarDemo() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false); // Start closed on mobile
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previousModels, setPreviousModels] = useState<
    {
      id: string;
      jobTitle: string;
    }[]
  >([]);
  const { isSignedIn } = useAuth();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-open sidebar on desktop, keep closed on mobile
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && open) {
        const sidebar = document.querySelector("[data-sidebar]");
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, open]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, open]);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          className="fixed top-4 left-4 z-50 bg-neutral-800 hover:bg-neutral-700 text-white p-2 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          data-sidebar
          className={`
            ${isMobile ? "fixed" : "relative"} 
            ${isMobile ? "z-50" : "z-auto"}
            ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}
            transition-transform duration-300 ease-in-out
            ${isMobile ? "w-80" : "w-auto"}
          `}
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="flex flex-col justify-between h-screen bg-neutral-950">
              {/* Top section with create button */}
              {open && isSignedIn && (
                <div className="flex justify-baseline items-center gap-2">
                  <Button
                    className="bg-transparent w-10 h-10 hover:bg-neutral-800"
                    onClick={() => {
                      router.push("/dashboard");
                      if (isMobile) setOpen(false);
                    }}
                  >
                    <House className="w-5 h-5" />
                  </Button>

                  <Button
                    className="bg-white text-black hover:bg-gray-200 flex-1 text-sm"
                    onClick={() => {
                      if (isSignedIn) {
                        router.push("/dashboard/interview");
                        if (isMobile) setOpen(false);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
              )}

              {!open && isSignedIn && (
                <div className="p-2">
                  <Button
                    className="bg-white text-black hover:bg-gray-200 w-full"
                    onClick={() => {
                      router.push("/dashboard/interview");
                      if (isMobile) setOpen(false);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Middle section with previous entries */}
              <div className="flex flex-1 flex-col overflow-hidden sm:px-2 px-0">
                <div className="mt-4 flex flex-col gap-2 text-white">
                  {open && (
                    <Label className="text-white text-sm">
                      Previous Entries
                    </Label>
                  )}
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32 animate-spin text-white">
                      <Loader className="w-6 h-6" />
                    </div>
                  ) : previousModels.length === 0 ? (
                    <div
                      className={`flex items-center justify-center h-32 text-white ${
                        !open ? "hidden" : ""
                      }`}
                    >
                      <Label className="text-white text-sm">
                        No Previous Entries
                      </Label>
                    </div>
                  ) : (
                    <div className="overflow-y-auto flex-1 space-y-1">
                      {previousModels.map((model, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            router.push(`/dashboard/interview/${model.id}`);
                            if (isMobile) setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <SidebarLink
                            className="text-white transition-colors"
                            link={{
                              label: model.jobTitle,
                              href: `/dashboard/interview/${model.id}`,
                              icon: (
                                <Text className="h-4 w-4 shrink-0 text-white" />
                              ),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom section with auth */}
              <div className="p-2 border-t border-neutral-800">
                <SignedOut>
                  <SignInButton mode="modal">
                    {open ? (
                      <Button className="w-full px-4 py-2 text-white text-sm bg-neutral-800 hover:bg-neutral-700">
                        Sign In
                      </Button>
                    ) : (
                      <Button className="p-2 w-full text-white text-sm bg-neutral-800 hover:bg-neutral-700">
                        <IconUserBolt className="w-5 h-5 mx-auto" />
                      </Button>
                    )}
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center justify-between text-white">
                    {open ? (
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1">
                          <UserButton
                            afterSignOutUrl="/"
                            showName={true}
                            appearance={{
                              baseTheme: dark,
                              variables: {
                                colorText: "white",
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                        </div>

                        <Button
                          className="p-2 bg-transparent hover:bg-neutral-800 text-white"
                          onClick={() => setShowProfile(true)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>

                        <SignOutButton>
                          <Button
                            variant="ghost"
                            className="p-2 bg-transparent hover:text-white hover:bg-neutral-800"
                            onClick={async () => {
                              await signOut();
                              router.push("/");
                              if (isMobile) setOpen(false);
                              window.location.reload();
                            }}
                          >
                            <LogOut className="w-4 h-4 text-red-400" />
                          </Button>
                        </SignOutButton>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            baseTheme: dark,
                            elements: {
                              userButtonAvatarBox: "w-8 h-8",
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </SignedIn>
              </div>
            </SidebarBody>
          </Sidebar>
        </div>

        {/* User Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full overflow-auto">
              <UserProfile
                routing="hash"
                appearance={{
                  baseTheme: dark,
                  elements: {
                    card: "bg-neutral-900 text-white max-w-full",
                  },
                }}
              />
              <Button
                className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 text-xs p-2"
                onClick={() => setShowProfile(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
