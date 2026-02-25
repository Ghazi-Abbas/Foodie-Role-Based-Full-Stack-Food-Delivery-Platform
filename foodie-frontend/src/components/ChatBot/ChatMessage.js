export default function ChatMessage({ text }) {
  return (
    <div style={wrapper}>
      <div style={bubble}>
        {text}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  display: "flex",
  justifyContent: "flex-end",
};

const bubble = {
  maxWidth: "78%",
  background: "linear-gradient(135deg, #4c9cff, #357dff)",
  color: "white",
  borderRadius: "18px 18px 4px 18px",
  padding: "10px 14px",
  fontSize: 14,
  lineHeight: 1.4,
  wordBreak: "break-word",
  boxShadow: "0 8px 22px rgba(0,0,0,.35)",
};
