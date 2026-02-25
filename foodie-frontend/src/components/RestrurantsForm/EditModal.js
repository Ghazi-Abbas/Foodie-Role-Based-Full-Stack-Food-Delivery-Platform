import { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/Modal.css";

/* Same regex rules as Form.js */
const rules = {
  phone: /^[6-9]\d{9}$/,
  panCard: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  fssaiLicence: /^[0-9]{14}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  accNo: /^[0-9]{9,18}$/
};

export default function EditModal({ title, data, setData, apiUrl, onClose }) {
  const [formData, setFormData] = useState({ ...data });
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Auto-save when user stops typing
  useEffect(() => {
    if (!dirty) return;

    const timer = setTimeout(() => autoSave(), 1200);
    return () => clearTimeout(timer);
  }, [formData]);

  const validate = () => {
    for (let key in formData) {
      if (formData[key] === "" || formData[key] === null) {
        toast.error(`${key} cannot be empty`);
        return false;
      }

      if (rules[key] && !rules[key].test(formData[key])) {
        toast.error(`Invalid ${key}`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.put(apiUrl, formData);
      setData(res.data);
      toast.success("Changes saved");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    try {
      await api.put(apiUrl, formData);
      toast.dismiss();
      toast.success("Auto-saved", { autoClose: 1000 });
      setDirty(false);
    } catch {}
  };

  const uploadImage = async (file) => {
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await api.post("/upload", fd);
      setFormData({ ...formData, image: res.data.url });
      setDirty(true);

      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>

        {Object.keys(formData).map((key) => (
          key !== "image" && (
            <input
              key={key}
              value={formData[key]}
              onChange={(e) => {
                setDirty(true);
                setFormData({ ...formData, [key]: e.target.value });
              }}
              placeholder={key}
            />
          )
        ))}

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        <div className="modal-actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
