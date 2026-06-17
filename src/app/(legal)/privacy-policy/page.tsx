import type { Metadata } from "next";
import {
  Shield,
  Database,
  Share2,
  Lock,
  Cookie,
  UserCheck,
  ExternalLink,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Lunora Studio",
  description:
    "Learn how The Lunora Studio collects, uses, and protects your personal information when you shop for handcrafted pipe-cleaner bouquets.",
};

/* ─── section data ───────────────────────────────────────────── */

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const ICON_CLASS =
  "size-5 shrink-0 text-dusty-rose transition-colors duration-200 group-hover:text-gold";

const sections: Section[] = [
  {
    id: "information-we-collect",
    icon: <Database className={ICON_CLASS} aria-hidden="true" />,
    title: "Information We Collect",
    content: (
      <>
        <h3 className="mt-6 font-heading text-lg font-medium text-charcoal">
          Personal Information
        </h3>
        <p className="mt-2 leading-relaxed text-muted">
          When you create an account, place an order, or contact us, we may
          collect:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted marker:text-dusty-rose/60">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number (including WhatsApp number)</li>
          <li>Delivery address</li>
          <li>
            Custom order preferences (bouquet colours, flower types, personal
            messages)
          </li>
        </ul>

        <h3 className="mt-8 font-heading text-lg font-medium text-charcoal">
          Account Information
        </h3>
        <p className="mt-2 leading-relaxed text-muted">
          We use Supabase Authentication with Google OAuth. When you sign in with
          Google, we receive your name, email address, and profile picture from
          your Google account. We do not store your Google password.
        </p>

        <h3 className="mt-8 font-heading text-lg font-medium text-charcoal">
          Automatically Collected Information
        </h3>
        <p className="mt-2 leading-relaxed text-muted">
          When you browse our website, we may automatically collect:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted marker:text-dusty-rose/60">
          <li>Browser type and version</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>Pages visited and time spent on each page</li>
          <li>Referring website URL</li>
          <li>IP address (anonymised where possible)</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    icon: <Shield className={ICON_CLASS} aria-hidden="true" />,
    title: "How We Use Your Information",
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We use the information we collect to:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted marker:text-dusty-rose/60">
          <li>Process and fulfil your bouquet orders</li>
          <li>Create and manage your account</li>
          <li>
            Communicate with you about orders, custom designs, and delivery
            updates via email or WhatsApp
          </li>
          <li>Respond to your enquiries and provide customer support</li>
          <li>Improve our website, products, and services</li>
          <li>
            Send occasional marketing communications (only with your consent)
          </li>
          <li>Prevent fraud and maintain the security of our platform</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-share",
    icon: <Share2 className={ICON_CLASS} aria-hidden="true" />,
    title: "How We Share Your Information",
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We do <strong className="text-charcoal">not</strong> sell, rent, or
          trade your personal information. We may share your data only in the
          following limited circumstances:
        </p>
        <div className="mt-4 space-y-3">
          {[
            {
              label: "Service Providers",
              desc: "We use Supabase (database & authentication), Vercel (hosting), and Google (OAuth sign-in). These providers process data on our behalf under strict confidentiality agreements.",
            },
            {
              label: "Delivery Partners",
              desc: "Your name, phone number, and delivery address may be shared with courier services solely for delivering your order.",
            },
            {
              label: "Legal Requirements",
              desc: "We may disclose information if required by law, regulation, or legal process.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-cream-dark/50 px-4 py-3"
            >
              <p className="text-sm font-medium text-charcoal">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "data-storage",
    icon: <Lock className={ICON_CLASS} aria-hidden="true" />,
    title: "Data Storage & Security",
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Your data is stored securely on Supabase&apos;s cloud infrastructure
          with Row Level Security (RLS) policies ensuring that users can only
          access their own data. All data transmission between your browser and
          our servers is encrypted using HTTPS/TLS.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          While we take commercially reasonable measures to protect your
          information, no method of electronic storage or transmission is 100%
          secure. We cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    icon: <Cookie className={ICON_CLASS} aria-hidden="true" />,
    title: "Cookies",
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Our website uses cookies for:
        </p>
        <div className="mt-4 space-y-3">
          {[
            {
              label: "Essential Cookies",
              desc: "Authentication session cookies required to keep you signed in.",
            },
            {
              label: "Analytics Cookies",
              desc: "Anonymous usage data to help us improve the website experience.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-cream-dark/50 px-4 py-3"
            >
              <p className="text-sm font-medium text-charcoal">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 leading-relaxed text-muted">
          You can control cookies through your browser settings. Disabling
          essential cookies may prevent you from signing in or placing orders.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    icon: <UserCheck className={ICON_CLASS} aria-hidden="true" />,
    title: "Your Rights",
    content: (
      <>
        <p className="leading-relaxed text-muted">
          You have the right to:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted marker:text-dusty-rose/60">
          <li>
            <strong className="text-charcoal">Access</strong> the personal
            information we hold about you
          </li>
          <li>
            <strong className="text-charcoal">Correct</strong> inaccurate or
            incomplete information
          </li>
          <li>
            <strong className="text-charcoal">Delete</strong> your account and
            associated data
          </li>
          <li>
            <strong className="text-charcoal">Withdraw consent</strong> for
            marketing communications at any time
          </li>
          <li>
            <strong className="text-charcoal">Request a copy</strong> of your
            data in a portable format
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-muted">
          To exercise any of these rights, please contact us using the details
          below.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    icon: <ExternalLink className={ICON_CLASS} aria-hidden="true" />,
    title: "Third-Party Links",
    content: (
      <p className="leading-relaxed text-muted">
        Our website may contain links to third-party websites such as Instagram
        (@thelunorastudio) and WhatsApp. We are not responsible for the privacy
        practices of these external sites. We encourage you to read their
        privacy policies before sharing any information.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    icon: <Baby className={ICON_CLASS} aria-hidden="true" />,
    title: "Children's Privacy",
    content: (
      <p className="leading-relaxed text-muted">
        Our website is not intended for children under the age of 13. We do not
        knowingly collect personal information from children. If you believe a
        child has provided us with personal data, please contact us so we can
        delete it.
      </p>
    ),
  },
  {
    id: "changes",
    icon: <RefreshCw className={ICON_CLASS} aria-hidden="true" />,
    title: "Changes to This Policy",
    content: (
      <p className="leading-relaxed text-muted">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated &quot;Last Updated&quot; date. We
        encourage you to review this policy periodically.
      </p>
    ),
  },
  {
    id: "contact",
    icon: <Mail className={ICON_CLASS} aria-hidden="true" />,
    title: "Contact Us",
    content: (
      <>
        <p className="leading-relaxed text-muted">
          If you have any questions or concerns about this Privacy Policy, please
          reach out to us:
        </p>
        <div className="mt-4 space-y-3">
          {[
            {
              label: "Email",
              href: "mailto:lunorastudio.blooms@gmail.com",
              text: "lunorastudio.blooms@gmail.com",
              external: false,
            },
            {
              label: "WhatsApp",
              href: "https://wa.me/918149102923",
              text: "+91 81491 02923",
              external: true,
            },
            {
              label: "Instagram",
              href: "https://www.instagram.com/thelunorastudio",
              text: "@thelunorastudio",
              external: true,
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group/link flex items-center gap-3 rounded-lg bg-cream-dark/50 px-4 py-3 transition-colors duration-200 hover:bg-blush/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
            >
              <span className="text-sm font-medium text-charcoal">
                {item.label}
              </span>
              <span className="text-sm text-dusty-rose transition-colors duration-200 group-hover/link:text-gold">
                {item.text}
              </span>
            </a>
          ))}
        </div>
      </>
    ),
  },
];

/* ─── page component ─────────────────────────────────────────── */

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dusty-rose/30 to-transparent" />
          <Shield
            className="size-5 text-dusty-rose"
            aria-hidden="true"
          />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dusty-rose/30 to-transparent" />
        </div>

        <h1 className="text-center font-heading text-3xl font-light tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
          Privacy Policy
        </h1>

        <p className="text-center text-sm tracking-wide text-muted">
          Effective 17 June 2026 · Last updated 17 June 2026
        </p>

        <div className="luxury-divider" />
      </header>

      {/* ── Intro ───────────────────────────────────────────── */}
      <div className="glass-card rounded-xl px-6 py-5">
        <p className="leading-relaxed text-muted">
          The Lunora Studio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          operates the website{" "}
          <a
            href="https://lunorastudio.vercel.app"
            className="font-medium text-dusty-rose transition-colors duration-200 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
          >
            lunorastudio.vercel.app
          </a>{" "}
          and associated services. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our
          website or place an order for our handcrafted pipe-cleaner bouquets.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          By using our website, you agree to the collection and use of
          information in accordance with this policy.
        </p>
      </div>

      {/* ── Sections ────────────────────────────────────────── */}
      {sections.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          className="group glass-card scroll-mt-24 rounded-xl px-6 py-6 transition-shadow duration-300 hover:shadow-md hover:shadow-dusty-rose/5"
        >
          {/* Section heading */}
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-cream-dark transition-colors duration-200 group-hover:bg-blush/40">
              {section.icon}
            </span>
            <h2 className="font-heading text-xl font-normal tracking-tight text-charcoal sm:text-2xl">
              <span className="mr-2 text-dusty-rose/50">{i + 1}.</span>
              {section.title}
            </h2>
          </div>

          {/* Section body */}
          <div className="mt-4 border-t border-charcoal/5 pt-4">
            {section.content}
          </div>
        </section>
      ))}

      {/* ── Footer divider ──────────────────────────────────── */}
      <footer className="pt-4 text-center">
        <div className="luxury-divider mb-4" />
        <p className="text-xs tracking-wide text-muted/60">
          © {new Date().getFullYear()} The Lunora Studio. All rights reserved.
        </p>
      </footer>
    </article>
  );
}
