import { useLocation, useNavigate } from "react-router-dom";

function Token() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    navigate("/");
    return null;
  }

  const handlePrint = () => {
    window.print();

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h1>Registration Successful</h1>

      <h2>{data.name}</h2>

      <p>
        <strong>Department:</strong> {data.department}
      </p>

      <p>
        <strong>Token:</strong> {data.token}
      </p>

      <p>
        <strong>Time:</strong> {data.created_at}
      </p>

      <button onClick={handlePrint}>
        Print Token
      </button>
    </div>
  );
}

export default Token;