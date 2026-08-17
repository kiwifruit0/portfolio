export const roles = [
  {
    id: "natwest",
    title: "Software Engineer Intern",
    org: "NatWest Group",
    place: "London",
    period: "Jun 2026 - Aug 2026",
    tags: ["Java", "Spring Boot", "React", "Security"],
    summary:
      "Ten weeks on an internal platform team, building a secure file-transfer service used across the bank's internal network.",
    points: [
      "Designed and shipped a secure file-transfer solution, removing a long-standing size restriction and increasing the maximum transferable file size by roughly 400x.",
      "Built an automated request and approval pipeline in Java Spring Boot with a React frontend, cutting turnaround from days to minutes.",
      "Added automated malware scanning and audit logging to every transfer, replacing a manual review process.",
      "Worked inside a regulated codebase: code review, change control, and writing for the engineers who pick it up next."
    ]
  },
  {
    id: "technicus",
    title: "Junior Data Engineer",
    org: "Technicus Ltd",
    place: "London",
    period: "Jun 2025 - Sep 2025",
    tags: ["Python", "dbt", "SQL", "PowerShell", "Salesforce"],
    summary:
      "A summer on data-migration tooling, mostly Python, with a running theme of making manual processes repeatable.",
    points: [
      "Built a config-driven Python tool that ran dbt transformations through the full pipeline and triggered PowerShell scripts via the Salesforce Bulk Loader API, reducing a 40-step manual ETL process to 11.",
      "Supported a pre-production migration dry run, diagnosing and fixing data issues ahead of go-live.",
      "Improved the migration tooling's logging and exception handling so failures were actionable rather than silent.",
      "Documented the tooling and handed it over to the permanent engineering team."
    ]
  },
  {
    id: "spectrum",
    title: "Customer Service Assistant (part-time)",
    org: "Guildford Spectrum",
    place: "Guildford",
    period: "Aug 2022 - Sep 2025",
    tags: ["Communication", "Ops"],
    summary:
      "Three years on the front desk of a busy leisure centre, alongside sixth form and university.",
    points: [
      "Managed bookings, payments, and day-to-day enquiries during peak periods.",
      "Handled complaints and difficult conversations, usually turning them into good outcomes.",
      "Trained newer staff and covered shifts across the team.",
      "Kept tills and customer records accurate under pressure."
    ]
  }
];

export const volunteering = [
  {
    title: "Maths Tutor",
    period: "Sep 2022 - May 2023",
    detail: "Peer tutoring for Year 11 students preparing for GCSE Maths."
  },
  {
    title: "Parkrun Volunteer",
    period: "Aug 2022 - May 2023",
    detail: "Setup, timing, and marshalling across 25+ events."
  }
];
