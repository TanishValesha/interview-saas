import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-center items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={20} height={20} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              Intervu
            </h1>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/dashboard">
            <Button className="text-black bg-white text-sm hover:bg-neutral-300 font-semibold px-5 py-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
              Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
