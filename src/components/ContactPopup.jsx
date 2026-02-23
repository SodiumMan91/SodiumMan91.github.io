import { useEffect } from "react";

function ContactPopup({ type, close }) {
  const content =
    type === "phone"
      ? "(646) 200-1041"
      : "nb3236@columbia.edu";

  const title = type === "phone" ? "Phone Number" : "Email Address";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.className === "overlay") {
        close();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [close]);

  return (
    <div className="overlay" style={overlayStyle}>
      <div style={popupStyle}>
        <button onClick={close} style={closeStyle}>✕</button>
        <h2>{title}</h2>
        <p style={{ fontSize: "18px" }}>{content}</p>
        <button style={copyButtonStyle} onClick={copyToClipboard}>
          Copy
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const popupStyle = {
  background: "#111",
  padding: "40px",
  borderRadius: "12px",
  border: "1px solid #00f7ff",
  textAlign: "center",
  minWidth: "300px",
  position: "relative"
};

const closeStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  background: "none",
  border: "none",
  color: "#00f7ff",
  fontSize: "18px",
  cursor: "pointer"
};

const copyButtonStyle = {
  marginTop: "15px",
  padding: "8px 16px",
  background: "#00f7ff",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px"
};

export default ContactPopup;