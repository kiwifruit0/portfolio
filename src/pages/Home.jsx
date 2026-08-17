import { highlights, profile } from "../content/profile";

export default function Home() {
  return (
    <div className="page">
      <h1>{profile.name}</h1>

      <p className="lede">
        Final-year Computer Science student at Southampton. Graduating {profile.graduating}.
        Currently applying for 2027 software engineering graduate roles.
      </p>

      <p className="blank"></p>

      <p>
        I like building things that are practical and, ideally, actually fun to use. Most of what
        I enjoy sits close to the machine: systems programming on Linux, backends that have to be
        correct under load, and the occasional microcontroller on my desk at 2am.
      </p>

      <p className="blank"></p>

      <p>
        Two summers of industry so far. In 2026 I was a software engineer at NatWest, building a
        secure file-transfer service for the bank's internal network; the year before I was a data
        engineer at Technicus, replacing a manual migration process with tooling that could be run
        twice and give the same answer.
      </p>

      <p className="blank"></p>

      <h3>// highlights</h3>
      <ul>
        {highlights.map((item) => (
          <li key={item.label}>
            <b>{item.label}</b> — {item.detail}
          </li>
        ))}
      </ul>

      <p className="blank"></p>

      <h3>// right now</h3>
      <ul>
        <li>Final year at Southampton, on track for a first, starting my individual project.</li>
        <li>Open to graduate software engineering roles starting summer/autumn 2027.</li>
        <li>Reading a lot about distributed systems, and finally learning Rust properly.</li>
        <li>Still entering hackathons. Two wins so far, aiming for a third this year.</li>
      </ul>

      <p className="blank"></p>

      <h3>// this site is an editor</h3>
      <p>
        The cursor below is real. It is measured against the actual rendered text, so vim motions
        land where you would expect them to.
      </p>
      <ul>
        <li>
          <kbd>h</kbd> <kbd>j</kbd> <kbd>k</kbd> <kbd>l</kbd> to move, <kbd>w</kbd> <kbd>b</kbd>{" "}
          <kbd>e</kbd> for words, <kbd>gg</kbd> and <kbd>G</kbd> to jump.
        </li>
        <li>
          <kbd>Ctrl</kbd>+<kbd>p</kbd> to find a file, <kbd>Ctrl</kbd>+<kbd>g</kbd> to grep every
          page at once.
        </li>
        <li>
          <kbd>Space</kbd> is the leader key. <kbd>:</kbd> opens the command line, try{" "}
          <kbd>:colorscheme</kbd> or <kbd>:neofetch</kbd>.
        </li>
        <li>
          <kbd>?</kbd> shows every keymap, and <kbd>gx</kbd> follows the link on the current line.
        </li>
      </ul>

      <p className="blank"></p>

      <h3>// outside of all that</h3>
      <p>
        Playing guitar and fixing up old ones, making music in Ableton, volleyball, and small
        hardware builds around ESP32 boards.
      </p>

      <p className="blank"></p>

      <p className="dim">-- press ? for keymaps, or :help --</p>
    </div>
  );
}
