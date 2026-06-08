"use client";
import Link from "next/link";
import React, { useState } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoogleLogin from "./GoogleLogin";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = { unknown: unknown };

const Nav = (props: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className=" flex justify-between items-center p-2 lg:px-8">
      <Link href={"/"} className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
          />
        </svg>
        <span className="font-bold text-xs lg:text-2xl">WORLD SEEKER</span>
      </Link>
      <div className="flex gap-2 cursor-pointer">
        <AnimatedThemeToggler />
        {user ? (
          <div className="flex items-center gap-2 border  rounded py-1  px-4 transition-all">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center">
                  <div className="bg-gray-400 text-white rounded-full border border-gray-400  overflow-hidden">
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={"user"}
                        height={24}
                        width={24}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 relative top-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  {user && (
                    <div className="pl-2 text-xs lg:text-base">
                      {user.displayName}
                    </div>
                  )}
                  {/* <div className="pl-2 text-sm">{user.displayName}</div> */}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      const slug = user.displayName!
                        ? user?.displayName.replace(/\s+/g, "-")
                        : "User";
                      router.push(`/${slug}`);
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Bookings</DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(`/Listings`);
                    }}
                  >
                    Listings
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-red-500"
                    onSelect={() => handleLogout()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <GoogleLogin unknown={undefined} />
        )}{" "}
      </div>
    </div>
  );
};

export default Nav;
