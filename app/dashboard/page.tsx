"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function BackgroundBeamsDemo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen w-full bg-transparent relative flex items-center justify-center antialiased">
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Ace your next interview with our AI-powered mock interview platform!
          </h2>
          <p className="text-md text-gray-300 mb-8">
            Get started by entering your email to receive updates and early
            access.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                setLoading(true);
                try {
                  const res = await fetch("/api/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });

                  const json = await res.json();

                  if (res.status === 400) {
                    toast.error(json.error || "Email already subscribed.");
                    setLoading(false);
                    return;
                  }

                  if (res.ok) {
                    toast.success(
                      "🎉 Subscribed successfully! Please check your inbox."
                    );
                    setLoading(false);
                    form.reset();
                  } else {
                    toast.error(json.error || "Subscription failed.");
                    setLoading(false);
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Something went wrong. Please try again.");
                  setLoading(false);
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <Mail className="h-4 w-4" />
                      Email <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="bg-black border-gray-700 text-white placeholder:text-gray-500 placeholder:font-medium"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <button
                disabled={loading}
                type="submit"
                className="mt-2 bg-white hover:bg-gray-300 text-black font-medium px-6 py-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing...." : "Subscribe"}
              </button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
