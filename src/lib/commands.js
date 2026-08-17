import { THEMES } from "./themes";
import { profile, links } from "../content/profile";
import { projects } from "../content/projects";

export const KEYMAPS = [
  { keys: "h j k l", desc: "move the cursor left / down / up / right" },
  { keys: "w  b  e", desc: "next word / previous word / end of word" },
  { keys: "0  ^  $", desc: "start of line / first non-blank / end of line" },
  { keys: "gg  G", desc: "top / bottom of the file" },
  { keys: "{  }", desc: "previous / next blank line" },
  { keys: "C-d  C-u", desc: "half page down / up" },
  { keys: "C-f  C-b", desc: "full page down / up" },
  { keys: "zz zt zb", desc: "centre / top / bottom the cursor line" },
  { keys: "gx  <CR>", desc: "open the link on the current line" },
  { keys: "/pattern", desc: "search the buffer" },
  { keys: "n  N", desc: "next / previous match" },
  { keys: "C-p", desc: "find files (Telescope)" },
  { keys: "C-g", desc: "live grep across every page" },
  { keys: ":", desc: "command line" },
  { keys: "<Space>", desc: "leader - hold to see the menu" },
  { keys: "?", desc: "this help window" },
  { keys: "Esc", desc: "close anything that is open" }
];

export const LEADER_MAP = [
  { keys: "ff", label: "find files", command: "find" },
  { keys: "fg", label: "live grep", command: "grep" },
  { keys: "fp", label: "find projects", command: "projects" },
  { keys: "fc", label: "find commands", command: "commands" },
  { keys: "e", label: "toggle file tree", command: "tree" },
  { keys: "t", label: "pick colorscheme", command: "colorscheme" },
  { keys: "n", label: "toggle relative numbers", command: "set rnu!" },
  { keys: "cv", label: "open my CV", command: "cv" },
  { keys: "gh", label: "open GitHub", command: "github" },
  { keys: "?", label: "keymaps", command: "help" }
];

const NEOFETCH_LOGO = [
  "   ▄▄▄▄▄▄▄▄   ",
  "  █  ▄▄▄▄  █  ",
  "  █ █    █ █  ",
  "  █ █ ▄▄ █ █  ",
  "  █ █ ██ █ █  ",
  "  █  ▀▀▀▀  █  ",
  "   ▀▀▀▀▀▀▀▀   "
];

function neofetchLines(theme) {
  const info = [
    `${profile.handle}@portfolio`,
    "-----------------------",
    `Name     : ${profile.name}`,
    `Role     : ${profile.role}`,
    `Status   : ${profile.status}`,
    `Grad     : ${profile.graduating}`,
    `Location : ${profile.location}`,
    `Shell    : react 19 + vite`,
    `Editor   : neovim (obviously)`,
    `Theme    : ${theme}`,
    `Projects : ${projects.length}`,
    `Contact  : ${profile.email}`
  ];

  const rows = Math.max(NEOFETCH_LOGO.length, info.length);
  const out = [];
  for (let i = 0; i < rows; i += 1) {
    const logo = (NEOFETCH_LOGO[i] || "").padEnd(16, " ");
    out.push(`${logo}${info[i] || ""}`);
  }
  return out;
}

const LAZY_PLUGINS = [
  ["react", "19.2", "the runtime"],
  ["vite", "7.3", "dev server + bundler"],
  ["pdfjs-dist", "5.5", "renders cv.pdf in the buffer"],
  ["@iconify/react", "6.0", "icons"],
  ["lineModel.lua", "local", "range-based cursor grid"],
  ["telescope.jsx", "local", "fuzzy finder + live grep"],
  ["which-key.jsx", "local", "leader menu"],
  ["colorschemes", "local", `${THEMES.length} themes`]
];

function lazyLines() {
  const lines = ["  Plugins loaded: " + LAZY_PLUGINS.length, ""];
  LAZY_PLUGINS.forEach(([name, version, note]) => {
    lines.push(`  ● ${name.padEnd(18)} ${version.padEnd(8)} ${note}`);
  });
  lines.push("");
  lines.push("  All of it hand-rolled. No plugin manager was harmed.");
  return lines;
}

// Builds the ex-command table. `ctx` wires the commands into app state.
export function createCommands(ctx) {
  const {
    fileName,
    files,
    navigate,
    theme,
    setTheme,
    showMessage,
    openFinder,
    openWindow,
    toggleSidebar,
    options,
    setOption,
    clearSearch,
    downloadCv
  } = ctx;

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const resolveFile = (name) =>
    files.find(
      (file) =>
        file === name ||
        file.startsWith(name) ||
        file.replace(/\.[^.]+$/, "") === name
    );

  const commands = [
    {
      name: "write",
      aliases: ["w", "w!", "wa"],
      desc: "pretend to save the buffer",
      run: () => showMessage(`"${fileName}" [readonly] 0L, 0B written`)
    },
    {
      name: "quit",
      aliases: ["q", "q!", "qa", "qa!"],
      desc: "try to leave",
      run: () => showMessage("E37: no :)", "error")
    },
    {
      name: "wq",
      aliases: ["x", "wq!"],
      desc: "save and try to leave",
      run: () => {
        showMessage(`"${fileName}" [readonly] 0L, 0B written`);
        setTimeout(() => showMessage("E37: still no :)", "error"), 1200);
      }
    },
    {
      name: "edit",
      aliases: ["e"],
      usage: ":e <file>",
      desc: "open a buffer",
      complete: () => files,
      run: (arg) => {
        if (!arg) {
          openFinder("files");
          return;
        }
        const match = resolveFile(arg);
        if (match) {
          navigate(match);
          showMessage(`"${match}"`);
        } else {
          showMessage(`E212: can't open file: ${arg}`, "error");
        }
      }
    },
    {
      name: "buffers",
      aliases: ["ls", "b"],
      desc: "list open buffers",
      run: () =>
        openWindow(
          "buffers",
          files.map(
            (file, index) =>
              `  ${String(index + 1).padStart(2)} ${file === fileName ? "%a" : "  "}   "${file}"`
          )
        )
    },
    {
      name: "bnext",
      aliases: ["bn"],
      desc: "next buffer",
      run: () => {
        const index = files.indexOf(fileName);
        navigate(files[(index + 1) % files.length]);
      }
    },
    {
      name: "bprevious",
      aliases: ["bp", "bprev"],
      desc: "previous buffer",
      run: () => {
        const index = files.indexOf(fileName);
        navigate(files[(index - 1 + files.length) % files.length]);
      }
    },
    {
      name: "colorscheme",
      aliases: ["colo", "theme"],
      usage: ":colorscheme [name]",
      desc: "change the colorscheme",
      complete: () => THEMES.map((entry) => entry.id),
      run: (arg) => {
        if (!arg) {
          openFinder("themes");
          return;
        }
        const match = THEMES.find((entry) => entry.id === arg || entry.id.startsWith(arg));
        if (match) {
          setTheme(match.id);
          showMessage(`colorscheme ${match.id}`);
        } else {
          showMessage(`E185: cannot find colorscheme '${arg}'`, "error");
        }
      }
    },
    {
      name: "set",
      usage: ":set <option>",
      desc: "toggle number, relativenumber, cursorline, list",
      complete: () => [
        "number",
        "nonumber",
        "relativenumber",
        "norelativenumber",
        "rnu",
        "rnu!",
        "nornu",
        "cursorline",
        "nocursorline",
        "list",
        "nolist"
      ],
      run: (arg) => {
        const option = (arg || "").trim();
        const table = {
          number: ["number", true],
          nu: ["number", true],
          nonumber: ["number", false],
          nonu: ["number", false],
          relativenumber: ["relativeNumber", true],
          rnu: ["relativeNumber", true],
          norelativenumber: ["relativeNumber", false],
          nornu: ["relativeNumber", false],
          "rnu!": ["relativeNumber", !options.relativeNumber],
          cursorline: ["cursorLine", true],
          nocursorline: ["cursorLine", false],
          list: ["listChars", true],
          nolist: ["listChars", false]
        };
        const entry = table[option];
        if (!entry) {
          showMessage(`E518: unknown option: ${option}`, "error");
          return;
        }
        setOption(entry[0], entry[1]);
        showMessage(`set ${option}`);
      }
    },
    {
      name: "find",
      aliases: ["Telescope", "files"],
      desc: "fuzzy find a buffer",
      run: () => openFinder("files")
    },
    {
      name: "grep",
      aliases: ["rg", "livegrep"],
      usage: ":grep [pattern]",
      desc: "search every page at once",
      run: (arg) => openFinder("grep", arg || "")
    },
    {
      name: "projects",
      desc: "browse projects",
      run: () => openFinder("projects")
    },
    {
      name: "commands",
      desc: "fuzzy find a command",
      run: () => openFinder("commands")
    },
    {
      name: "tree",
      aliases: ["NvimTree", "Neotree"],
      desc: "toggle the file tree",
      run: () => toggleSidebar()
    },
    {
      name: "help",
      aliases: ["h"],
      desc: "keymaps and commands",
      run: () => openWindow("help", null, "help")
    },
    {
      name: "nohlsearch",
      aliases: ["noh", "nohl"],
      desc: "clear search highlighting",
      run: () => {
        clearSearch();
        showMessage("search cleared");
      }
    },
    {
      name: "cv",
      aliases: ["resume"],
      desc: "open cv.pdf",
      run: () => {
        navigate("cv.pdf");
        showMessage('"cv.pdf"');
      }
    },
    {
      name: "download",
      desc: "download the CV",
      run: () => {
        downloadCv();
        showMessage("downloading Toby_Jennings_CV.pdf");
      }
    },
    {
      name: "github",
      aliases: ["gh"],
      desc: "open my GitHub",
      run: () => openExternal(links.github)
    },
    {
      name: "linkedin",
      aliases: ["in"],
      desc: "open my LinkedIn",
      run: () => openExternal(links.linkedin)
    },
    {
      name: "email",
      aliases: ["mail"],
      desc: "email me",
      run: () => {
        window.location.href = links.email;
      }
    },
    {
      name: "Lazy",
      aliases: ["lazy"],
      desc: "what this site is built from",
      run: () => openWindow("lazy.nvim", lazyLines())
    },
    {
      name: "neofetch",
      aliases: ["fetch"],
      desc: "the obligatory one",
      run: () => openWindow("neofetch", neofetchLines(theme))
    },
    {
      name: "whoami",
      desc: "who am I",
      run: () => showMessage(`${profile.name} - ${profile.status.toLowerCase()}`)
    },
    {
      name: "date",
      desc: "current date",
      run: () => showMessage(new Date().toString())
    },
    {
      name: "split",
      aliases: ["sp", "vsplit", "vs"],
      desc: "splits, sadly",
      run: () => showMessage("E319: splits are not implemented. it's a website.", "error")
    },
    {
      name: "version",
      desc: "about this site",
      run: () =>
        openWindow("version", [
          "  portfolio.nvim - a website that thinks it is an editor",
          "",
          `  Built by ${profile.name}`,
          "  React 19 + Vite, no UI framework, no component library.",
          "",
          "  The cursor is measured against real DOM ranges, so it lands",
          "  on real characters. Try 'w', 'b', '$', 'gg', 'G', or C-p.",
          "",
          `  Source: ${profile.github}/portfolio`
        ])
    }
  ];

  return commands;
}

export function findCommand(commands, name) {
  return commands.find(
    (command) => command.name === name || (command.aliases || []).includes(name)
  );
}

export function commandNames(commands) {
  return commands.flatMap((command) => [command.name, ...(command.aliases || [])]);
}
