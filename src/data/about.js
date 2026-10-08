const aboutData = {
  hero: {
    quote: "The only true wisdom is in knowing you know nothing.",
    support: "- Socrates",
  },

  identity: {
    heading: "Engineering Perspective",

    terminal: [
      {
        prompt: "bighna@portfolio",
        path: "~/about",
        command: "whoami",

        output: [
          "Bighna Raj Bhattamishra",
          "B.Tech in Electronics & Telecommunication Engineering (2023–27)",
          "Building software around developer workflows, repositories and backend systems.",
          "Primarily focused on developer tooling, backend engineering and open source.",
        ],
      },

      {
        prompt: "bighna@portfolio",
        path: "~/about",
        command: "focus",

        output: [
          "Backend Engineering (MERN)",
          "Developer Tooling",
          "Python",
          "JavaScript",
          "TypeScript",
          "Git & GitHub",
        ],
      },

      {
        prompt: "bighna@portfolio",
        path: "~/about",
        command: "build",

        output: [
          "Developer tools and repository utilities.",
          "Backend systems, APIs and automation.",
          "GitHub-focused tools and open source projects.",
        ],
      },

      {
        prompt: "bighna@portfolio",
        path: "~/about",
        command: "direction",

        output: [
          "Growing toward backend engineering and developer tooling.",
          "Building deeper experience with open source and real-world collaboration.",
          "Exploring AI-assisted software development and modern engineering workflows.",
          "Aspiring to become a stronger backend engineer and open-source contributor.",
        ],
      },
    ],
  },

  domains: [
    [
      "Developer Tooling",
      "Building developer utilities with Python and JavaScript, from repository analysis and documentation tooling to workflow automation.",
    ],
    [
      "Backend Engineering",
      "Building backend services and APIs with JavaScript, while working with Node.js, Express, REST APIs, databases and server-side application logic.",
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
      "Web Development",
      "Building practical web applications with the MERN stack, JavaScript, React, HTML, CSS and the surrounding Vite and modern frontend ecosystem.",
    ],
  ],

  exploration: [
    [
      "MicroPython",
      "Running Python on constrained hardware and exploring how familiar programming patterns change when working with limited resources.",
    ],
    [
      "Embedded Systems",
      "Building small hardware-oriented projects with MicroPython and learning how software interacts with devices, peripherals and constrained environments.",
    ],
    [
      "AI-assisted Development",
      "Experimenting with AI as part of development workflows while keeping implementation decisions, debugging and engineering judgment human-driven.",
    ],
    [
      "Prompt Engineering",
      "Improving prompts, context and interaction patterns to make AI-assisted development more precise, useful and consistent.",
    ],
    [
      "Development Experience & Testing",
      "Exploring how development workflows, tooling, testing and validation can make software more efficient, predictable and maintainable.",
    ],
    [
      "System Design",
      "Studying how software systems are decomposed, connected, scaled and kept maintainable as their requirements grow.",
    ],
    [
      "Code Analysis",
      "Exploring parsers, source structure and static analysis techniques for understanding and validating software.",
    ],
  ],

  openSource: {
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

        output: ["OSCG26", "SWoC26", "ELUSOC26", "GSSoC26", "SSoC26"],
      },

      {
        prompt: "bighna@portfolio",
        path: "~/portfolio/open-source",
        command: "roles --ECSoC26",

        output: ["Technical Mentor", "Project Administrator"],
      },

      {
        prompt: "bighna@portfolio",
        path: "~/portfolio/open-source",
        command: "git config --get philosophy",

        output: [
          ">> The wise leave no trace of needless work!!!",
          ">> Forge the work worthy of the hands that follow.",
          ">> Think lightly of yourself and deeply of the world.",
          ">> One who understands the terrain needs fewer moves.",
          ">> Know what you can change, and what you should leave untouched.",
        ],
      },
    ],

    button: {
      label: "Explore my GitHub →",
      to: "/github",
    },
  },

  contact: {
    heading: "Get In Touch",

    links: [
      {
        label: "GitHub",
        href: "https://github.com/Facelessism",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/bighnaraj-bhattamishra",
      },
      {
        label: "Email",
        href: "mailto:bighna2005@gmail.com",
      },
    ],

    certificates: {
      label: "Certificates & Publications →",
      to: "/certificates",
    },
  },
};

export default aboutData;
