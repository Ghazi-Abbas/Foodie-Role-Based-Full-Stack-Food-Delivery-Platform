import { useEffect, useState } from "react";

const Addresses = () => {
  const [address, setAddress] = useState(null);

  // 🔄 Load address from localStorage
  const loadAddress = () => {
    const stored = localStorage.getItem("deliveryAddress");
    if (stored) {
      setAddress(stored); // ✅ plain string
    } else {
      setAddress(null);
    }
  };

  useEffect(() => {
    loadAddress();

    // 🔥 Listen when navbar updates location
    const handleAddressUpdate = () => {
      loadAddress();
    };

    window.addEventListener("address-change", handleAddressUpdate);
    window.addEventListener("storage", handleAddressUpdate);

    return () => {
      window.removeEventListener("address-change", handleAddressUpdate);
      window.removeEventListener("storage", handleAddressUpdate);
    };
  }, []);

  /* ================= UI ================= */

  // ❌ NO ADDRESS
  if (!address) {
    return (
      <div style={styles.emptyPanel}>
        <h2>Addresses</h2>
        <p>No addresses saved.</p>

        <div style={styles.hintBox}>
          <span style={styles.icon}>📍</span>
          <p>
            Use <strong>Live Location</strong> from the navbar
            to detect your address automatically.
          </p>
        </div>
      </div>
    );
  }

  // ✅ ADDRESS FOUND
  return (
    <div style={styles.page}>
      <h2>Your Address</h2>

      <div style={styles.card}>
        <h4 style={styles.label}>Delivery Address</h4>
        <p style={styles.text}>{address}</p>
      </div>
    </div>
  );
};

export default Addresses;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "20px",
  },
  emptyPanel: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
  },
  hintBox: {
    marginTop: "16px",
    padding: "12px",
    background: "#f9f9f9",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
  },
  icon: {
    fontSize: "18px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    maxWidth: "500px",
  },
  label: {
    margin: 0,
    fontSize: "16px",
  },
  text: {
    marginTop: "8px",
    fontSize: "14px",
    lineHeight: "1.5",
  },
};
