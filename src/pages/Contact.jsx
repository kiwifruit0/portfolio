import { Icon } from "@iconify/react";

const contactItems = [
  {
    label: "GitHub",
    value: "github.com/kiwifruit0",
    href: "https://github.com/kiwifruit0",
    actionLabel: "open profile",
    icon: "mdi:github",
    external: true
  },
  {
    label: "Phone",
    value: "+44 7981 920045",
    href: "tel:+447981920045",
    actionLabel: "call",
    icon: "mdi:phone-outline"
  },
  {
    label: "Email",
    value: "tobysj@proton.me",
    href: "mailto:tobysj@proton.me",
    actionLabel: "email",
    icon: "mdi:email-outline"
  }
];

export default function Contact() {
  return (
    <div className="page contact-page">
      <h1>Contact</h1>

      <p>
        The fastest way to reach me is by email. You can also find my work on GitHub or call me directly.
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
    </div>
  );
}
