import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // ✅ FIXED HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, email, password } = values;

      // 🔥 Validation
      if (!name || !email || !password) {
        toast.error("All fields are required", toastOptions);
        return;
      }

      setLoading(true);

      const { data } = await axios.post(registerAPI, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response) {
        toast.error(error.response.data.message || "Server error", toastOptions);
      } else {
        toast.error("Network error. Check backend!", toastOptions);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: { color: { value: "#000" } },
            fpsLimit: 60,
            particles: {
              number: { value: 200 },
              color: { value: "#ffcc00" },
              size: { value: 3 },
              move: { enable: true, speed: 2 },
            },
          }}
          style={{
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <Container className="mt-5" style={{ position: "relative", zIndex: 2, color: "white" }}>
          <Row>
            <h1 className="text-center">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
            </h1>
            <h1 className="text-center text-white">
              Welcome to Expense Management System
            </h1>

            <Col md={{ span: 6, offset: 3 }}>
              <h2 className="text-white text-center mt-5">Registration</h2>

              {/* ✅ FORM SUBMIT FIX */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="mt-4 text-center">
                  <Button type="submit" className="btnStyle" disabled={loading}>
                    {loading ? "Registering..." : "Signup"}
                  </Button>

                  <p className="mt-3">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                  </p>
                </div>
              </Form>
            </Col>
          </Row>

          <ToastContainer />
        </Container>
      </div>
    </>
  );
};

export default Register;