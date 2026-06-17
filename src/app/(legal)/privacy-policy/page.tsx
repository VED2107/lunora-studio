import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Lunora Studio",
  description:
    "Learn how The Lunora Studio collects, uses, and protects your personal information when you shop for handcrafted pipe-cleaner bouquets.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="font-heading text-4xl font-light text-[#2F2926]">
        Privacy Policy
      </h1>

      <p className="text-sm text-[#7D7068]">
        <strong>Effective Date:</strong> 17 June 2026
        <br />
        <strong>Last Updated:</strong> 17 June 2026
      </p>

      <p>
        The Lunora Studio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
        operates the website{" "}
        <a
          href="https://lunorastudio.vercel.app"
          className="text-[#CDA4B5] underline"
        >
          lunorastudio.vercel.app
        </a>{" "}
        and associated services. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit our website
        or place an order for our handcrafted pipe-cleaner bouquets.
      </p>

      <p>
        By using our website, you agree to the collection and use of information
        in accordance with this policy.
      </p>

      {/* ── 1. Information We Collect ───────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        1. Information We Collect
      </h2>

      <h3 className="font-heading text-xl font-normal text-[#2F2926]">
        1.1 Personal Information
      </h3>
      <p>
        When you create an account, place an order, or contact us, we may
        collect:
      </p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number (including WhatsApp number)</li>
        <li>Delivery address</li>
        <li>Custom order preferences (bouquet colours, flower types, messages)</li>
      </ul>

      <h3 className="font-heading text-xl font-normal text-[#2F2926]">
        1.2 Account Information
      </h3>
      <p>
        We use Supabase Authentication with Google OAuth. When you sign in with
        Google, we receive your name, email address, and profile picture from
        your Google account. We do not store your Google password.
      </p>

      <h3 className="font-heading text-xl font-normal text-[#2F2926]">
        1.3 Automatically Collected Information
      </h3>
      <p>When you browse our website, we may automatically collect:</p>
      <ul>
        <li>Browser type and version</li>
        <li>Device type (desktop, mobile, tablet)</li>
        <li>Pages visited and time spent on each page</li>
        <li>Referring website URL</li>
        <li>IP address (anonymised where possible)</li>
      </ul>

      {/* ── 2. How We Use Your Information ─────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        2. How We Use Your Information
      </h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process and fulfill your bouquet orders</li>
        <li>Create and manage your account</li>
        <li>
          Communicate with you about orders, custom designs, and delivery updates
          via email or WhatsApp
        </li>
        <li>Respond to your enquiries and provide customer support</li>
        <li>Improve our website, products, and services</li>
        <li>Send occasional marketing communications (only with your consent)</li>
        <li>Prevent fraud and maintain the security of our platform</li>
      </ul>

      {/* ── 3. How We Share Your Information ───────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        3. How We Share Your Information
      </h2>
      <p>
        We do <strong>not</strong> sell, rent, or trade your personal information.
        We may share your data only in the following limited circumstances:
      </p>
      <ul>
        <li>
          <strong>Service Providers:</strong> We use Supabase (database &amp;
          authentication), Vercel (hosting), and Google (OAuth sign-in). These
          providers process data on our behalf under strict confidentiality
          agreements.
        </li>
        <li>
          <strong>Delivery Partners:</strong> Your name, phone number, and
          delivery address may be shared with courier services solely for
          delivering your order.
        </li>
        <li>
          <strong>Legal Requirements:</strong> We may disclose information if
          required by law, regulation, or legal process.
        </li>
      </ul>

      {/* ── 4. Data Storage & Security ────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        4. Data Storage &amp; Security
      </h2>
      <p>
        Your data is stored securely on Supabase&apos;s cloud infrastructure
        with Row Level Security (RLS) policies ensuring that users can only
        access their own data. All data transmission between your browser and our
        servers is encrypted using HTTPS/TLS.
      </p>
      <p>
        While we take commercially reasonable measures to protect your
        information, no method of electronic storage or transmission is 100%
        secure. We cannot guarantee absolute security.
      </p>

      {/* ── 5. Cookies ────────────────────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        5. Cookies
      </h2>
      <p>Our website uses cookies for:</p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Authentication session cookies
          required to keep you signed in.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Anonymous usage data to help us
          improve the website experience.
        </li>
      </ul>
      <p>
        You can control cookies through your browser settings. Disabling
        essential cookies may prevent you from signing in or placing orders.
      </p>

      {/* ── 6. Your Rights ────────────────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        6. Your Rights
      </h2>
      <p>You have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> the personal information we hold about you
        </li>
        <li>
          <strong>Correct</strong> inaccurate or incomplete information
        </li>
        <li>
          <strong>Delete</strong> your account and associated data
        </li>
        <li>
          <strong>Withdraw consent</strong> for marketing communications at any
          time
        </li>
        <li>
          <strong>Request a copy</strong> of your data in a portable format
        </li>
      </ul>
      <p>
        To exercise any of these rights, please contact us using the details
        below.
      </p>

      {/* ── 7. Third-Party Links ──────────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        7. Third-Party Links
      </h2>
      <p>
        Our website may contain links to third-party websites such as Instagram
        (@thelunorastudio) and WhatsApp. We are not responsible for the privacy
        practices of these external sites. We encourage you to read their privacy
        policies before sharing any information.
      </p>

      {/* ── 8. Children's Privacy ─────────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        8. Children&apos;s Privacy
      </h2>
      <p>
        Our website is not intended for children under the age of 13. We do not
        knowingly collect personal information from children. If you believe a
        child has provided us with personal data, please contact us so we can
        delete it.
      </p>

      {/* ── 9. Changes to This Policy ─────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        9. Changes to This Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated &quot;Last Updated&quot; date. We
        encourage you to review this policy periodically.
      </p>

      {/* ── 10. Contact Us ────────────────────────────────────── */}
      <h2 className="font-heading text-2xl font-normal text-[#2F2926]">
        10. Contact Us
      </h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        reach out to us:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:lunorastudio.blooms@gmail.com"
            className="text-[#CDA4B5] underline"
          >
            lunorastudio.blooms@gmail.com
          </a>
        </li>
        <li>
          <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/918149102923"
            className="text-[#CDA4B5] underline"
          >
            +91 81491 02923
          </a>
        </li>
        <li>
          <strong>Instagram:</strong>{" "}
          <a
            href="https://www.instagram.com/thelunorastudio"
            className="text-[#CDA4B5] underline"
          >
            @thelunorastudio
          </a>
        </li>
      </ul>
    </article>
  );
}
