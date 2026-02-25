import ChatDataCard from "./ChatDataCard";

export default function ChatMenu({ data, sendMessage,onNavigateBack, closeChat}) {
  if (!data) return null;

  return (
    <>
      {/* BOT MESSAGE */}
      {data.reply && (
        <div style={botStyle}>
          <p style={{ marginBottom: 8 }}>{data.reply}</p>

          {/* MENU */}
          {data.type === "menu" && Array.isArray(data.menu) && (
            <div style={menuWrapper}>
              {data.menu.map((item, index) => (
                <button
                  key={index}
                  style={menuBtn}
                  onClick={() => sendMessage(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {data.type === "error" && (
            <div style={errorBox}>❌ {data.reply}</div>
          )}
        </div>
      )}

      {/* CARDS */}
      {data.type === "cards" && Array.isArray(data.data) && (
        <div style={cardWrapper}>
          {data.data.map((item, index) => (
            <ChatDataCard key={item.itemId || index} item={item}  onNavigateBack={onNavigateBack}  closeChat={closeChat}   />
          ))}
        </div>
      )}
    </>
  );
}

/* styles unchanged */


/* ================= STYLES ================= */

const botStyle = {
  alignSelf: "flex-start",
  maxWidth: "85%",
  background: "rgba(255,255,255,.1)",
  padding: "14px 16px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.25)",
  color: "white",
  fontSize: 14
};

const menuWrapper = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 10
};

const menuBtn = {
  height: 46,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.35)",
  background: "rgba(255,255,255,.18)",
  color: "white",
  cursor: "pointer",
  fontSize: 13
};

const cardWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 6
};

const errorBox = {
  background: "rgba(255,50,50,0.2)",
  border: "1px solid rgba(255,50,50,0.4)",
  borderRadius: 10,
  padding: "8px 10px",
  color: "#ffaaaa",
  fontSize: 13
};
