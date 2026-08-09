export const domains = [
  [
    "Developer Tooling",
    "Building developer utilities primarily with Python and JavaScript, from repository analysis and documentation tooling to workflow automation.",
  ],

  [
    "Backend Engineering",
    "Building backend services and APIs primarily with JavaScript, while working with Node.js, Express, REST APIs, databases and server-side application logic.",
  ],

  [
    "Software Architecture",
    "Designing projects around clear modules, services, data flows and maintainable boundaries preventing any tangled code.",
  ],

  [
    "Automation",
    "Using Python, JavaScript and GitHub workflows to automate repetitive development, repositories and project tasks.",
  ],

  [
    "Repository Analysis",
    "Working with Git repositories, file structures, parsers and metadata to build tools that can understand a codebase.",
  ],

  [
    "Git & GitHub",
    "Using Git for version control and GitHub for repositories, issues, pull requests, collaboration and project automation.",
  ],

  [
    "Documentation",
    "Building and maintaining technical documentation with Markdown and documentation tooling, with a focus on making project knowledge easier to navigate and maintain.",
  ],

  [
    "Open Source",
    "Actively contributing to real repositories through programs such as OSCG26, SWoC26, ELUSOC26, GSSoC26 and SSoC26, while also mentoring and administering projects.",
  ],

  [
    "Web Development",
    "Building practical web applications with JavaScript, React, HTML, CSS and the surrounding Vite and modern frontend ecosystems.",
  ],
];

export const exploration = [
  [
    "MicroPython",
    "Running Python on constrained hardware and exploring how familiar programming patterns change when working with limited resources.",
  ],

  [
    "Embedded Systems",
    "Building small hardware-oriented projects with MicroPython and learning how software interacts with devices, peripherals, and constrained environments.",
  ],

  [
    "Process Management",
    "Exploring how Python-based programs can be scheduled, managed, monitored, and run concurrently as a lightweight process system.",
  ],

  [
    "Firmware Updates",
    "Investigating GitHub-based approaches for remotely delivering newer firmware versions and application scripts to MicroPython devices.",
  ],

  [
    "Repository Intelligence",
    "Exploring how software can understand repository structure, dependencies, files, and relationships instead of treating a codebase as isolated files.",
  ],

  [
    "AI-assisted Development",
    "Experimenting with AI as part of development workflows while keeping implementation decisions, debugging, and engineering judgment human-driven.",
  ],

  [
    "Prompt Engineering",
    "Improving prompts, context and interaction patterns to make AI-assisted development more precise, useful and consistent.",
  ],

  [
    "System Design",
    "Studying how larger software systems are decomposed, connected, scaled and kept maintainable as their requirements grow.",
  ],
];

export const openSource = {
  heading: "Open Source",

  terminal: [
    {
      prompt: "bighna@portfolio",
      path: "~/portfolio/open-source",
      command: "git status",

      output: [
        "Learning in public.",
        "Contributing where it matters.",
        "Working with real projects and real collaborators.",
      ],
    },

    {
      prompt: "bighna@portfolio",
      path: "~/portfolio/open-source",
      command: "programs --participated as contributor",

      output: [
        "OSCG26",
        "SWoC26",
        "ELUSOC26",
        "GSSoC26",
        "SSoC26",
      ],
    },

    {
      prompt: "bighna@portfolio",
      path: "~/portfolio/open-source",
      command: "roles --ECSoC26",

      output: [
        "Technical Mentor",
        "Project Administrator",
      ],
    },

    {
      prompt: "bighna@portfolio",
      path: "~/portfolio/open-source",
      command: "git config philosophy",

      output: [
        "Understand the code before changing it.",
        "Understand why something exists.",
        "Keep changes focused.",
        "Respect the existing architecture.",
        "Leave the repository better than I found it.",
      ],
    },
  ],

  button: {
    label: "Explore my GitHub →",
    to: "/github",
  },
};
