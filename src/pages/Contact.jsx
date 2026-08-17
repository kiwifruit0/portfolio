import { Icon } from "@iconify/react";
import { profile, links } from "../content/profile";

const contactItems = [
  {
    label: "Email",
    value: profile.email,
    href: links.email,
    actionLabel: "email",
    icon: "mdi:email-outline"
  },
  {
    label: "LinkedIn",
    value: profile.linkedin,
    href: links.linkedin,
    actionLabel: "connect",
    icon: "mdi:linkedin",
    external: true
  },
  {
    label: "GitHub",
    value: profile.github,
    href: links.github,
    actionLabel: "open profile",
    icon: "mdi:github",
    external: true
  },
  {
    label: "Website",
    value: profile.website,
    href: links.website,
    actionLabel: "visit",
    icon: "mdi:web",
    external: true
  },
  {
    label: "Phone",
    value: profile.phone,
    href: links.phone,
    actionLabel: "call",
    icon: "mdi:phone-outline"
  }
];

export default function Contact() {
  return (
    <div className="page contact-page">
      <h1>Contact</h1>

      <p className="lede">
        Email is fastest, and I reply to everything. Based in {profile.location}, happy to talk
        about graduate roles, internships, or anything you are building.
      </p>

      <p className="blank"></p>

      <ul className="contact-list">
        {contactItems.map((item) => (
          <li key={item.label} className="contact-item">
            <div className="contact-item-main">
              <div className="contact-item-header">
                <span className="contact-label">
                  <Icon icon={item.icon} width={17} />
                  {item.label}
                </span>

                <a
                  className="contact-action"
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                >
                  {item.actionLabel}
                </a>
              </div>

              <a
                className="contact-value"
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {item.value}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <p className="blank"></p>

      <p className="dim">
        -- put the cursor on any line above and press gx to open it, or run :email --
      </p>
    </div>
  );
}
