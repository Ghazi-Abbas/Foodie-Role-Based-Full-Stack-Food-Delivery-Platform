import { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

export default function FloatingChat({ user }) {
  const [hover, setHover] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* FLOATING WIDGET */}
      {!openChat && (
        <div style={styles.wrapper}>
          <div
            style={{
              ...(hover || isMobile ? styles.expanded : styles.compact),
              transform: hover
                ? "translateY(-1px) scale(1.02)"
                : "translateY(0px) scale(1)",
            }}
            onMouseEnter={() => !isMobile && setHover(true)}
            onMouseLeave={() => !isMobile && setHover(false)}
            onClick={() => setOpenChat(true)}
          >
            <span style={styles.arrow}>
              {(hover || isMobile) ? "✕" : "➤"}
            </span>

            {(hover || isMobile) && (
              <span style={styles.text}>
                Connect with a Product Expert
              </span>
            )}

            <div style={styles.avatar}>
              <span style={styles.bot}>🤖</span>
              <span style={styles.online}></span>
            </div>
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      {openChat && (
        <div style={isMobile ? styles.mobileWindow : styles.window}>
          <div style={styles.top}>
            <span>Foodie Assistant</span>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setOpenChat(false)}
            >
              ✕
            </span>
          </div>

          <div style={styles.body}>
            <ChatBot
              user={user}
              closeChat={() => setOpenChat(false)}   
            />
          </div>
        </div>
      )}
    </>
  );
}

// ================= STYLES =================

const styles = {

  wrapper: {
    position: "fixed",
    bottom: 22,
    right: 22,
    zIndex: 9999
  },

  /* DEFAULT SMALL */
  compact: {
    background: "linear-gradient(145deg, rgba(0,0,0,.9), rgba(45,45,45,.9))",
    backdropFilter: "blur(10px)",
    padding: "7px 10px",
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",

    boxShadow: `
      0 35px 80px rgba(0,0,0,.55),
      inset 0 1px 8px rgba(255,255,255,.15)
    `,

    transition: "all .3s cubic-bezier(.22,1,.36,1)",
    border: "1px solid rgba(255,255,255,.12)",
    minWidth: 62
  },

  /* EXPANDED */
  expanded: {
    background: "linear-gradient(145deg, rgba(0,0,0,.9), rgba(30,30,30,.95))",
    backdropFilter: "blur(15px)",
    color: "white",

    padding: "11px 18px",
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",

    minWidth: 290,

    boxShadow: `
      0 45px 120px rgba(0,0,0,.7),
      inset 0 1px 12px rgba(255,255,255,.22)
    `,

    transition: "all .3s cubic-bezier(.22,1,.36,1)",
    border: "1px solid rgba(255,255,255,.14)",
    whiteSpace: "nowrap"
  },

  arrow: {
    color: "white",
    fontSize: 18
  },

  text: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.3
  },

  /* AVATAR */
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",

    boxShadow: "0 10px 35px rgba(0,0,0,.45)",
    transition: "all .25s ease"
  },

  bot: {
    fontSize: 22,
    color: "black"
  },

  online: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 11,
    height: 11,
    background: "#2ecc71",
    borderRadius: "50%",
    border: "2px solid white",
    boxShadow: "0 0 6px rgba(46,204,113,.7)"
  },

  /* DESKTOP CHAT WINDOW */
  window: {
    position: "fixed",
    bottom: 25,
    right: 25,
    width: 430,
    height: 560,

    background: "rgba(255,255,255,.98)",
    backdropFilter: "blur(14px)",
    borderRadius: 22,
    overflow: "hidden",

    boxShadow: `
      0 55px 130px rgba(0,0,0,.65),
      inset 0 1px 16px rgba(255,255,255,.35)
    `,

    transition: "all .3s ease",
    zIndex: 999999
  },

  /* MOBILE FULL SCREEN */
  mobileWindow: {
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100vw",
    height: "100vh",

    background: "white",
    borderRadius: 0,
    overflow: "hidden",

    boxShadow: "0 -5px 30px rgba(0,0,0,.4)",
    zIndex: 999999
  },

  top: {
    background: "linear-gradient(120deg, #ff3b3b, #ff6b6b)",
    padding: "13px 14px",
    color: "white",
    fontSize: 15,
    fontWeight: 800,
    display: "flex",
    justifyContent: "space-between"
  },

  body: {
    height: "100%"
  }
};
