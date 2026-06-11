import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Home() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    department: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Inject keyframe CSS once on mount
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .spinner-ring {
        width: 60px;
        height: 60px;
        border: 7px solid #e3f2fd;
        border-top: 7px solid #1976d2;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px auto;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.age || !form.gender || !form.mobile || !form.department) {
      return "All required fields must be filled";
    }
    if (Number(form.age) < 1 || Number(form.age) > 120) {
      return "Age must be between 1 and 120";
    }
    if (form.mobile.length !== 10 || !/^\d+$/.test(form.mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/api/patients", form);
      navigate("/token", { state: res.data });
    } catch (err) {
      setError("Server error. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ======= LOADING OVERLAY ======= */}
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <div className="spinner-ring"></div>
            <p style={styles.overlayTitle}>Generating Token...</p>
            <p style={styles.overlaySubtitle}>⏳ Please wait while we process your registration</p>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <h1 style={styles.heading}>🏥 Patient Self Check-in Kiosk</h1>
        <p style={styles.subtitle}>Please complete your registration below</p>

        <form style={styles.form} onSubmit={handleSubmit}>

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            style={styles.input}
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="text"
            name="address"
            placeholder="Address (Optional)"
            value={form.address}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Generating Token..." : "Generate Token"}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eaf4ff, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative"
  },

  /* --- Overlay --- */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999
  },
  overlayCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "40px 48px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    minWidth: "280px"
  },
  overlayTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1976d2",
    margin: "0 0 8px 0"
  },
  overlaySubtitle: {
    fontSize: "14px",
    color: "#666",
    margin: 0
  },

  /* --- Form --- */
  container: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    border: "2px solid #1976d2",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)"
  },
  heading: { color: "#1976d2", marginBottom: "10px" },
  subtitle: { color: "#555", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #90caf9"
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    fontWeight: "bold"
  },
  error: { color: "#d32f2f", fontWeight: "bold", margin: 0 }
};

export default Home;