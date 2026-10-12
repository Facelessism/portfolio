import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/my-scroll.css";
import myScrollIcon from "../assets/myscroll-icon.svg";
import profilePic from "../assets/profile_pic.png";
import scrollAudio from "../assets/liaoyuan.mp3";

const LAUNCHER_SIZE = 48;
const EDGE_GAP = 12;
const PANEL_GAP = 12;
const PANEL_FALLBACK_WIDTH = 500;
const DRAG_THRESHOLD = 6;
const LOGO_SELECTOR = ".logo";
const POSITION_KEY = "my-scroll:position";
const MUTE_KEY = "my-scroll:muted";

const scrollData = {
  eyebrow: "#HeyItsMe!!!",
  name: "Bighna Raj Bhattamishra",
  role: "B.Tech in Electronics & Telecommunication Engineering",
  period: "2023–2027",
  summary:
    "I spend most of my time trying to understand systems from the inside, how they are structured, where they break and what it takes to make them more useful and efficient.",
  intro:
    "I’m drawn to the less visible parts of software: backend systems, developer tools, code analysis and the small utils that sit between them.",
  current: [
    "Working deeper into backend engineering",
    "Building developer tools and repository utilities",
    "Exploring code analysis and developer experience",
    "Contributing more deliberately to open source",
    "Understanding how larger systems are actually designed and maintained",
  ],
  principles: [
    "I prefer understanding a system before I try to change it",
    "I like pushing small ideas further than they first appear to deserve",
    "I’m more interested in the machinery behind software than in the surface users see",
  ],
  philosophy: "The right move begins with understanding what cannot be seen.",
  stamp: "道永恒",
  aboutLink: {
    label: "Open full profile",
    to: "/about",
  },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const storage = {
  get(key, area = "sessionStorage") {
    try {
      const raw = window[area].getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  },

  set(key, value, area = "sessionStorage") {
    try {
      window[area].setItem(key, JSON.stringify(value));
    } catch {}
  },
};

function getDefaultPosition() {
  const logo = document.querySelector(LOGO_SELECTOR);

  if (!logo) {
    return {
      x: window.innerWidth - LAUNCHER_SIZE - EDGE_GAP,
      y: EDGE_GAP + 8,
    };
  }

  const rect = logo.getBoundingClientRect();

  return {
    x: rect.right + 12,
    y: rect.top + rect.height / 2 - LAUNCHER_SIZE / 2,
  };
}

function getPanelPosition(launcher, width, height) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const panelWidth = Math.min(
    width || PANEL_FALLBACK_WIDTH,
    viewportWidth - EDGE_GAP * 2,
  );

  const fitsRight = launcher.x + panelWidth <= viewportWidth - EDGE_GAP;

  const x = clamp(
    fitsRight ? launcher.x : launcher.x + LAUNCHER_SIZE - panelWidth,
    EDGE_GAP,
    Math.max(EDGE_GAP, viewportWidth - panelWidth - EDGE_GAP),
  );

  const below = launcher.y + LAUNCHER_SIZE + PANEL_GAP;
  const above = launcher.y - height - PANEL_GAP;

  const maxY = Math.max(EDGE_GAP, viewportHeight - height - EDGE_GAP);

  let y;

  if (below + height <= viewportHeight - EDGE_GAP) {
    y = below;
  } else if (above >= EDGE_GAP) {
    y = above;
  } else {
    y = maxY;
  }

  return { x, y };
}

function useDraggable({ onDragEnd }) {
  const [position, setPosition] = useState({
    x: EDGE_GAP,
    y: EDGE_GAP,
  });

  const [dragging, setDragging] = useState(false);

  const positionRef = useRef(position);
  const sessionRef = useRef(null);
  const movedRef = useRef(false);
  const onDragEndRef = useRef(onDragEnd);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  const place = useCallback((point) => {
    const next = {
      x: clamp(
        point.x,
        EDGE_GAP,
        Math.max(EDGE_GAP, window.innerWidth - LAUNCHER_SIZE - EDGE_GAP),
      ),
      y: clamp(
        point.y,
        EDGE_GAP,
        Math.max(EDGE_GAP, window.innerHeight - LAUNCHER_SIZE - EDGE_GAP),
      ),
    };

    positionRef.current = next;

    setPosition((current) =>
      current.x === next.x && current.y === next.y ? current : next,
    );
  }, []);

  const reclamp = useCallback(() => place(positionRef.current), [place]);

  const onPointerDown = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    sessionRef.current = {
      id: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: positionRef.current.x,
      originY: positionRef.current.y,
    };

    movedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event) => {
      const session = sessionRef.current;

      if (!session || session.id !== event.pointerId) {
        return;
      }

      const dx = event.clientX - session.pointerX;
      const dy = event.clientY - session.pointerY;

      if (!movedRef.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
        return;
      }

      if (!movedRef.current) {
        movedRef.current = true;
        setDragging(true);
      }

      place({
        x: session.originX + dx,
        y: session.originY + dy,
      });
    },
    [place],
  );

  const finish = useCallback((event) => {
    const session = sessionRef.current;

    if (!session || session.id !== event.pointerId) {
      return;
    }

    const wasDragged = movedRef.current;

    sessionRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragging(false);

    if (wasDragged) {
      onDragEndRef.current?.(positionRef.current);
    }
  }, []);

  const consumeDrag = useCallback(() => {
    const wasDragged = movedRef.current;
    movedRef.current = false;
    return wasDragged;
  }, []);

  return {
    position,
    place,
    reclamp,
    dragging,
    consumeDrag,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
  };
}

function useScrollAudio(src, { volume = 0.6, fadeMs = 450 } = {}) {
  const audioRef = useRef(null);
  const frameRef = useRef(null);
  const wantedRef = useRef(false);

  const [muted, setMuted] = useState(
    () => storage.get(MUTE_KEY, "localStorage") === true,
  );

  const mutedRef = useRef(muted);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [src]);

  const fadeTo = useCallback((target, duration, onDone) => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const from = audio.volume;
    const start = performance.now();

    const step = (now) => {
      const progress = duration > 0 ? Math.min((now - start) / duration, 1) : 1;

      audio.volume = from + (target - from) * progress;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
        onDone?.();
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, []);

  const halt = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    fadeTo(0, fadeMs, () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [fadeMs, fadeTo]);

  const begin = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || mutedRef.current) {
      return;
    }

    audio.currentTime = 0;
    audio.volume = 0;

    const playPromise = audio.play();

    if (!playPromise) {
      return;
    }

    playPromise
      .then(() => {
        if (wantedRef.current && !mutedRef.current) {
          fadeTo(volume, fadeMs);
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      })
      .catch(() => {});
  }, [fadeMs, fadeTo, volume]);

  const play = useCallback(() => {
    wantedRef.current = true;
    begin();
  }, [begin]);

  const stop = useCallback(() => {
    wantedRef.current = false;
    halt();
  }, [halt]);

  const toggleMuted = useCallback(() => {
    const next = !mutedRef.current;

    mutedRef.current = next;
    setMuted(next);
    storage.set(MUTE_KEY, next, "localStorage");

    if (next) {
      halt();
    } else if (wantedRef.current) {
      begin();
    }
  }, [begin, halt]);

  return {
    play,
    stop,
    muted,
    toggleMuted,
  };
}

function SoundIcon({ on }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" fill="currentColor" />

      {on ? (
        <path
          d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="m16 9.5 4 5m0-5-4 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function InkWash() {
  return (
    <div className="my-scroll-wash" aria-hidden="true">
      <svg viewBox="0 0 500 150" preserveAspectRatio="none">
        <path
          d="M0 126C58 105 82 117 126 95C176 70 207 111 251 86C299 59 327 105 372 78C414 54 455 71 500 44V150H0Z"
          fill="currentColor"
        />

        <path
          d="M0 132C58 111 90 123 132 103C181 79 208 116 253 94C302 69 331 111 376 85C420 61 458 79 500 52"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity=".55"
        />

        <circle cx="412" cy="48" r="20" fill="currentColor" opacity=".16" />
      </svg>
    </div>
  );
}

function MyScroll() {
  const navigate = useNavigate();
  const panelId = useId();

  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const pinnedRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({
    x: 0,
    y: 0,
  });

  const sound = useScrollAudio(scrollAudio);

  const { position, place, reclamp, dragging, consumeDrag, bind } =
    useDraggable({
      onDragEnd: (point) => {
        pinnedRef.current = true;
        storage.set(POSITION_KEY, point);
      },
    });

  useLayoutEffect(() => {
    const saved = storage.get(POSITION_KEY);

    pinnedRef.current = Boolean(saved);
    place(saved ?? getDefaultPosition());
  }, [place]);

  useEffect(() => {
    const handleResize = () => {
      if (pinnedRef.current) {
        reclamp();
      } else {
        place(getDefaultPosition());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [place, reclamp]);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    const panel = panelRef.current;

    if (!panel) {
      return undefined;
    }

    const update = () => {
      const next = getPanelPosition(
        position,
        panel.offsetWidth,
        panel.offsetHeight,
      );

      setPanelPosition((current) =>
        current.x === next.x && current.y === next.y ? current : next,
      );
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(panel);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [open, position]);

  useLayoutEffect(() => {
    panelRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  const closeScroll = useCallback(
    ({ restoreFocus = true } = {}) => {
      if (restoreFocus && panelRef.current?.contains(document.activeElement)) {
        launcherRef.current?.focus();
      }

      setOpen(false);
      sound.stop();
    },
    [sound],
  );

  const openScroll = useCallback(() => {
    setOpen(true);
    sound.play();
  }, [sound]);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeScroll();
      }
    };

    const handlePointerDown = (event) => {
      if (
        panelRef.current?.contains(event.target) ||
        launcherRef.current?.contains(event.target)
      ) {
        return;
      }

      closeScroll({ restoreFocus: false });
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, closeScroll]);

  const handleClick = () => {
    if (consumeDrag()) {
      return;
    }

    if (open) {
      closeScroll();
    } else {
      openScroll();
    }
  };

  const openProfile = () => {
    closeScroll({ restoreFocus: false });
    navigate(scrollData.aboutLink.to);
  };

  return (
    <div className={`my-scroll ${open ? "is-open" : ""}`}>
      <button
        ref={launcherRef}
        type="button"
        className={`my-scroll-launcher ${dragging ? "is-dragging" : ""}`}
        style={{
          "--scroll-x": `${position.x}px`,
          "--scroll-y": `${position.y}px`,
        }}
        aria-label={open ? "Close profile scroll" : "Open profile scroll"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleClick}
        {...bind}
      >
        <img src={myScrollIcon} alt="" draggable="false" />
      </button>

      <section
        id={panelId}
        ref={panelRef}
        className="my-scroll-panel"
        style={{
          "--panel-x": `${panelPosition.x}px`,
          "--panel-y": `${panelPosition.y}px`,
        }}
        role="dialog"
        aria-label="Profile"
        aria-hidden={!open}
      >
        <div className="my-scroll-paper">
          <div className="my-scroll-roller my-scroll-roller-top">
            <span />
          </div>

          <div className="my-scroll-sheet">
            <InkWash />

            <div className="my-scroll-content">
              <div className="my-scroll-header">
                <span className="my-scroll-eyebrow">{scrollData.eyebrow}</span>

                <div className="my-scroll-actions">
                  <button
                    type="button"
                    className="my-scroll-icon-btn"
                    aria-label="Ambient sound"
                    aria-pressed={!sound.muted}
                    onClick={sound.toggleMuted}
                  >
                    <SoundIcon on={!sound.muted} />
                  </button>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="my-scroll-icon-btn"
                    aria-label="Close profile scroll"
                    onClick={() => closeScroll()}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="my-scroll-identity">
                <div className="my-scroll-seal">
                  <img src={profilePic} alt="" draggable="false" />
                </div>

                <div>
                  <h2>{scrollData.name}</h2>

                  <p>
                    {scrollData.role} · {scrollData.period}
                  </p>
                </div>
              </div>

              <section className="my-scroll-section my-scroll-me">
                <p className="my-scroll-intro">{scrollData.summary}</p>

                <p className="my-scroll-intro">{scrollData.intro}</p>
              </section>

              <div className="my-scroll-divider" />

              <section className="my-scroll-section">
                <h3 className="my-scroll-label">CURRENTLY</h3>

                <ul className="my-scroll-list">
                  {scrollData.current.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="my-scroll-section">
                <h3 className="my-scroll-label">
                  A FEW THINGS THAT GUIDE HOW I WORK
                </h3>

                <ul className="my-scroll-list">
                  {scrollData.principles.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <blockquote>{scrollData.philosophy}</blockquote>

              <div className="my-scroll-footer">
                <button type="button" onClick={openProfile}>
                  {scrollData.aboutLink.label}
                </button>

                <span className="my-scroll-stamp" lang="zh" aria-hidden="true">
                  {scrollData.stamp}
                </span>
              </div>
            </div>
          </div>

          <div className="my-scroll-roller my-scroll-roller-bottom">
            <span />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyScroll;
