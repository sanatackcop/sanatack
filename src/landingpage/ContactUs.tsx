// src/pages/ContactUs.tsx
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContactUs() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: hook this to your backend / email service (e.g. API call)
    setStatus("submitted");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-[#09090b]">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            Contact Us
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Have a question about Sanatack, your account, or a partnership idea?
            Send us a message.
          </p>

          <Card className="border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="How can we help?"
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  Send message
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {status === "submitted" && (
                <Alert className="border-emerald-500/60 bg-emerald-50/80 dark:bg-emerald-950/40">
                  <AlertTitle>Message sent</AlertTitle>
                  <AlertDescription>
                    Thank you for contacting us. We&apos;ll review your message
                    and respond soon.
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Prefer email? Reach us directly at{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  support@sanatack.com
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
