import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../utils/api";

const ActivateAccount = () => {
  const [activationCode, setActivationCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const activationToken = searchParams.get("token"); 

    try {
      const response = await API.post("/users/activate-user", {
        activation_token: activationToken,
        activation_code: activationCode,
      });
      setMessage(response.data.message || "Account activated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Activation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Activate Account</h2>
      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleActivate}>
        <div className="mb-3">
          <label htmlFor="activationCode" className="form-label">
            Activation Code:
          </label>
          <input
            type="text"
            className="form-control"
            id="activationCode"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Activating..." : "Activate"}
        </button>
      </form>
    </div>
  );
};

export default ActivateAccount;
