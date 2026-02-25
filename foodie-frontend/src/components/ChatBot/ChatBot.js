import { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import UserMessage from "./ChatMessage";
import BotMessage from "./ChatMenu";

/* ✅ MENU (used only when needed) */
const MENU_REPLY = {
  type: "menu",
  reply: "Hi 👋 What would you like to explore today?",
  menu: [
    { label: "🥬 Veg Items", value: "veg" },
    { label: "🍗 Non-Veg Items", value: "nonveg" },
    { label: "🍟 Snacks", value: "snacks" },
    { label: "🥤 Beverages", value: "beverages" },
    { label: "🍰 Desserts", value: "desserts" },
    { label: "🛒 View Cart", value: "cart" },
    { label: "📦 My Orders", value: "orders" },
    { label: "🧑‍💼 Support", value: "support" }
  ]
};

export default function ChatBot({ user, closeChat }) {   // 🔥 UPDATED
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    setMessages([{ sender: "bot", reply: MENU_REPLY }]);
  }, []);

  const handleReturnFromCard = () => {
    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        reply: {
          type: "text",
          reply: "✅ Explore the page and buy whatever you like."
        }
      },
      {
        sender: "bot",
        reply: MENU_REPLY
      }
    ]);
  };

  /* ================= SEND ================= */
  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const token =
        user?.token ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      const res = await axios.post(
        "http://localhost:8080/api/chat",
        {
          message: msg,
          loggedIn: true,
          userId: user?.id || null
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      setMessages(prev => {
        const next = [...prev, { sender: "bot", reply: res.data }];

        /**
         * ✅ IMPORTANT FIX (kept as-is)
         * Show default menu ONLY if backend returned plain text
         * NEVER override backend menu/cards
         */
        if (res.data?.type === "text") {
          next.push({ sender: "bot", reply: MENU_REPLY });
        }

        return next;
      });

    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          reply: { type: "text", reply: "❌ Server error. Try again." }
        },
        { sender: "bot", reply: MENU_REPLY }
      ]);
    }

    setLoading(false);
  };

  /* ================= UI ================= */
  return (
    <div style={styles.wrapper}>
      <div style={styles.chatArea}>
        {messages.map((m, i) =>
          m.sender === "user" ? (
            <UserMessage key={i} text={m.text} />
          ) : (
            <BotMessage
              key={i}
              data={m.reply}
              sendMessage={sendMessage}
              onNavigateBack={handleReturnFromCard}
              closeChat={closeChat}    
            />
          )
        )}

        {loading && <div style={styles.typing}>Assistant is typing…</div>}
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type your message…"
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.btn} onClick={() => sendMessage()}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    height: "92%",
    display: "flex",
    flexDirection: "column",
    background: "#0d0d0d",
    color: "white"
  },
  chatArea: {
    flex: 1,
    padding: 14,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  typing: {
    color: "#aaa",
    fontSize: 13
  },
  inputArea: {
    display: "flex",
    padding: 12,
    borderTop: "1px solid rgba(255,255,255,.1)"
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 10
  },
  btn: {
    marginLeft: 8,
    borderRadius: "50%",
    padding: 10
  }
};
