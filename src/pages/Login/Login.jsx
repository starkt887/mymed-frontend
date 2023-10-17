import { useState, useEffect } from "react";
// import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import { Alert, AlertTitle, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
// import ButtonGroup from "@mui/material/ButtonGroup";
import Register from "../Register/Register";
import Link from "@mui/material/Link";
import { _isEmpty, _isEmail, _isMobile } from "../../helper/validatiion";
import { useNavigate, useParams } from "react-router-dom";
import { signInAPI, verifyvlinkAPI } from "../../services/AuthService";
import toast from "react-hot-toast";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useDispatch } from "react-redux";
import { __RESET__, SET_LOADING } from "../../redux/appReducer";
import { UPDATE_USER } from "../../redux/userReducer";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import doctorlogin from "../../assets/doctorlogin.jpg";
import patientlogin from "../../assets/patientlogin.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [toggle, setToggle] = useState("login");
  const [type, setType] = useState("users");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //account verification
  const { usertype, verification_code } = useParams();
  const [isVerified, setisVerified] = useState(undefined);

  useEffect(() => {
    dispatch(__RESET__());
    if (usertype && verification_code) verifyAccount();
    if (usertype) {
      setType(usertype);
    }
  }, [usertype]);

  const verifyAccount = async () => {
    dispatch(SET_LOADING(true));
    setisVerified("verifying");
    const [res, error] = await verifyvlinkAPI({
      type: usertype,
      vcode: verification_code,
    });
    if (res) {
      toast.success(res.data.message);
      setisVerified("true");
    } else {
      toast.error(error.response.data.message);
      setisVerified("false");
    }
    dispatch(SET_LOADING(false));
  };

  const _validate = () => {
    let passwordErr = false;
    let emailErr = false;

    if (_isEmpty(password)) {
      passwordErr = true;
      setPasswordError("Required");
    } else {
      setPasswordError("");
    }
    if (_isEmpty(email)) {
      emailErr = true;
      setEmailError("Required");
    } else {
      if (_isEmail(email)) {
        setEmailError("");
      } else {
        emailErr = true;
        setEmailError("Please enter valid email");
      }
    }
    if (passwordErr || emailErr) return false;
    return true;
  };

  const _login = async () => {
    if (_validate()) {
      dispatch(SET_LOADING(true));
      const [res, error] = await signInAPI({ email, password, type });
      if (res) {
        localStorage.setItem("token", res.data.token);
        const userData = res.data.user;
        userData.isLoggedIn = true;
        userData.role = type === "users" ? "USER" : "DOCTOR";
        dispatch(UPDATE_USER(userData));
        toast.success("Logged In");
        navigate("/dashboard");
      } else {
        toast.error(error.response.data.message);
      }
      dispatch(SET_LOADING(false));
    }
  };

  const handleChange = (event, newAlignment) => {
    setType(event.target.value);
  };

  const forgetPasswordHandelClick = () => {
    setToggle("forgetpassword");
  };

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            background:
              type == "doctors"
                ? "url(" + doctorlogin + ")"
                : "url(" + patientlogin + ")",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: type == "doctors" ? "right" : "left",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* VERIFICATION */}
            {usertype && verification_code && (
              <>
                {isVerified == "true" && (
                  <Box bgcolor="#eaf9ed" borderRadius={2} p={2} m={2}>
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      <Typography variant="subtitle1">
                        Your email has been verified successfully!
                      </Typography>{" "}
                      <Typography variant="subtitle2">
                        <strong>Log In Now!</strong>
                      </Typography>
                    </Alert>
                  </Box>
                )}
                {isVerified == "false" && (
                  <Box bgcolor="#ffeced" borderRadius={2} p={2} m={2}>
                    <Alert severity="error">
                      <AlertTitle>Failed</AlertTitle>
                      <Typography variant="subtitle1">
                        Unable to verify your email!
                      </Typography>{" "}
                      <Typography variant="subtitle2">
                        Contact us at <strong>support@medrepertory.com</strong>{" "}
                        if problem persist.
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </>
            )}

            <Box sx={{ mb: 1 }}>
              <ToggleButtonGroup
                color="info"
                value={type}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton
                  sx={{ border: 0, color: "#3366cc" }}
                  value="users"
                >
                  Patient
                </ToggleButton>
                <ToggleButton
                  sx={{ border: 0, color: "#3366cc" }}
                  value="doctors"
                >
                  Doctor
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {toggle === "login" ? (
              <>
                <Grid container component="main">
                  <CssBaseline />
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{ borderRadius: "12px" }}
                  >
                    <Box
                      sx={{
                        my: 8,
                        mx: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: "12px",
                      }}
                    >
                      <Typography component="h1" variant="h5">
                        Login
                      </Typography>
                      <Typography
                        variant="p"
                        noWrap
                        component="div"
                        sx={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                        color="#4328be"
                      >
                        (B.E.T.A)
                      </Typography>
                      <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          fullWidth
                          error={!!emailError}
                          value={email}
                          id="email"
                          label="Email"
                          name="email"
                          size="small"
                          onChange={(e) => setEmail(e.target.value)}
                          helperText={emailError}
                        />
                        <TextField
                          margin="normal"
                          fullWidth
                          value={password}
                          error={!!passwordError}
                          onChange={(e) => setPassword(e.target.value)}
                          name="password"
                          label="Password"
                          size="small"
                          helperText={passwordError}
                          type="password"
                          id="password"
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={_login}
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                        <Grid container>
                          <Grid item xs>
                            <Link
                              style={{
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                              onClick={forgetPasswordHandelClick}
                            >
                              Forgot password?
                            </Link>
                          </Grid>
                          <Grid item>
                            <Link
                              onClick={() => {
                                setToggle("register");
                              }}
                              style={{
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                            >
                              Don't have an account? Register
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </>
            ) : toggle === "register" ? (
              <Register setToggle={setToggle} type={type} />
            ) : toggle === "forgetpassword" ? (
              <ForgetPassword setToggle={setToggle} type={type} />
            ) : (
              <></>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
