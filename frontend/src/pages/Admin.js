import { useEffect, useState } from "react";
import API from "../api";

function Admin() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await API.get("/api/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Search by name
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      fetchPatients();
      return;
    }

    try {
      const res = await API.get(`/api/patients?search=${value}`);
      setPatients(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Filter by department
  const filteredPatients = patients.filter((patient) => {
    if (!department) return true;
    return patient[6] === department;
  });

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by patient name"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.input}
      />

      {/* Department Filter */}
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={styles.input}
      >
        <option value="">All Departments</option>
        <option value="General Medicine">General Medicine</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Orthopedics">Orthopedics</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Pediatrics">Pediatrics</option>
      </select>

      {/* Patient Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Mobile</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Token</th>
            <th style={styles.th}>Registered Time</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.length === 0 ? (
            <tr>
              <td style={styles.noData} colSpan="8">
                No patients found
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient, index) => (
              <tr key={index}>
                <td style={styles.td}>{patient[0]}</td>
                <td style={styles.td}>{patient[1]}</td>
                <td style={styles.td}>{patient[2]}</td>
                <td style={styles.td}>{patient[3]}</td>
                <td style={styles.td}>{patient[4]}</td>
                <td style={styles.td}>{patient[6]}</td>
                <td style={styles.td}>{patient[7]}</td>
                <td style={styles.td}>{patient[8]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },

  input: {
    padding: "10px",
    margin: "10px",
    width: "220px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  table: {
    margin: "20px auto",
    borderCollapse: "collapse",
    width: "95%"
  },

  th: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f4f4f4"
  },

  td: {
    border: "1px solid #ddd",
    padding: "10px"
  },

  noData: {
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ddd"
  }
};

export default Admin;