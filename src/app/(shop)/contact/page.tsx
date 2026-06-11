"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstagramIcon from "@/components/icons/InstagramIcon";
import {
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Clock,
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 81491 02923",
    href: "https://wa.me/918149102923",
    color: "#25D366",
    description: "Fastest response — usually within an hour",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    value: "@thelunorastudio",
    href: "https://www.instagram.com/thelunorastudio",
    color: "#E1306C",
    description: "DMs open for inquiries & custom requests",
  },
  {
    icon: Mail,
    label: "Email",
    value: "lunorastudio.blooms@gmail.com",
    href: "mailto:lunorastudio.blooms@gmail.com",
    color: "#B89A6A",
    description: "For detailed custom order discussions",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 81491 02923",
    href: "tel:+918149102923",
    color: "#CDA4B5",
    description: "Calls welcome 10 AM – 8 PM IST",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any,
  });

  const onSubmit = async (data: ContactFormData) => {
    const body = `Hi Lunora Studio,%0A%0AName: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0ASubject: ${encodeURIComponent(data.subject)}%0A%0A${encodeURIComponent(data.message)}`;
    window.location.href = `mailto:lunorastudio.blooms@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${body}`;
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
  };

  const fieldClass =
    "border-[rgba(47,41,38,0.12)] bg-white focus-visible:ring-[#CDA4B5] text-[#2F2926]";
  const labelClass = "text-[#2F2926] text-sm font-medium";
  const errorClass = "text-xs text-red-600 mt-1";

  return (
    <div className="min-h-screen bg-[#F8F4EF]">
        {/* Hero strip */}
        <div className="border-b border-[rgba(47,41,38,0.06)] bg-white/60 pt-28 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#CDA4B5] mb-3">
              Get in Touch
            </p>
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light tracking-tight text-[#2F2926] sm:text-5xl">
              We&apos;d Love to Hear From You
            </h1>
            <p className="mt-4 max-w-xl text-[#7D7068] text-sm leading-relaxed">
              Questions about custom bouquets, bulk orders, gifting ideas, or
              just want to say hello? Reach out any way you&apos;d like.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left — channels + info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-light text-[#2F2926] mb-5">
                  Contact Channels
                </h2>
                <div className="space-y-3">
                  {CONTACT_CHANNELS.map((ch) => (
                    <a
                      key={ch.label}
                      href={ch.href}
                      target={ch.href.startsWith("mailto") || ch.href.startsWith("tel") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-4 transition-shadow hover:shadow-md cursor-pointer"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: ch.color + "18" }}
                      >
                        <ch.icon
                          className="h-4 w-4"
                          style={{ color: ch.color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#7D7068]">
                          {ch.label}
                        </p>
                        <p className="text-sm font-medium text-[#2F2926] mt-0.5 truncate group-hover:text-[#B89A6A] transition-colors">
                          {ch.value}
                        </p>
                        <p className="text-xs text-[#7D7068] mt-0.5">{ch.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-5 space-y-4">
                <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-light text-[#2F2926]">
                  Other Info
                </h3>
                <div className="flex items-start gap-3 text-sm text-[#7D7068]">
                  <Clock className="h-4 w-4 shrink-0 mt-0.5 text-[#CDA4B5]" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-[#2F2926]">Response Hours</p>
                    <p>Monday – Saturday, 10 AM – 8 PM IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#7D7068]">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[#CDA4B5]" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-[#2F2926]">Delivery</p>
                    <p>India — Delivering Nationwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-6 sm:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#F3E7E0] flex items-center justify-center">
                      <CheckCircle className="h-7 w-7 text-[#CDA4B5]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-[#2F2926]">
                        Message Ready to Send
                      </p>
                      <p className="mt-2 text-sm text-[#7D7068] max-w-xs">
                        Your email client has opened with the message pre-filled.
                        Hit send whenever you&apos;re ready — we&apos;ll reply soon.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="cursor-pointer border-[rgba(47,41,38,0.12)] text-[#7D7068] mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-[#2F2926] mb-6">
                      Send a Message
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className={labelClass}>Your Name</Label>
                          <Input
                            id="name"
                            {...register("name")}
                            placeholder="Ananya Sharma"
                            className={fieldClass}
                          />
                          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className={labelClass}>Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            className={fieldClass}
                          />
                          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="subject" className={labelClass}>Subject</Label>
                        <Input
                          id="subject"
                          {...register("subject")}
                          placeholder="Custom bouquet enquiry"
                          className={fieldClass}
                        />
                        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message" className={labelClass}>Message</Label>
                        <textarea
                          id="message"
                          {...register("message")}
                          rows={5}
                          placeholder="Tell us about your occasion, colour preferences, budget, or anything else…"
                          className="flex w-full rounded-md border border-[rgba(47,41,38,0.12)] bg-white px-3 py-2 text-sm text-[#2F2926] shadow-xs transition-colors placeholder:text-[#7D7068]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CDA4B5] resize-none"
                        />
                        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                        <p className="text-xs text-[#7D7068] text-right">
                          {watch("message")?.length ?? 0} characters
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 h-11"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening email…</>
                        ) : (
                          "Send Message"
                        )}
                      </Button>

                      <p className="text-xs text-center text-[#7D7068]">
                        This opens your email client with the message pre-filled.
                        For instant replies,{" "}
                        <a
                          href="https://wa.me/918149102923"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B89A6A] hover:underline"
                        >
                          WhatsApp us
                        </a>
                        .
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
