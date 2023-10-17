import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { _isEmpty, _isEmail, _isMobile } from "../../helper/validatiion";
import { useDispatch } from "react-redux";
import { __RESET__, SET_LOADING } from "../../redux/appReducer";
import toast from "react-hot-toast";
import { otpAPI, forgotpasswordAPI } from "../../services/AuthService";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function ForgetPassword({ setToggle, type }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [otpError, setOtpError] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [confirmpassError, setConfirmpassError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    _resetState();
  }, [type]);

  const _validate = () => {
    let passwordErr = false;
    let otpErr = false;
    let confirmpassErr = false;

    if (_isEmpty(password)) {
      passwordErr = true;
      setPasswordError("Required");
    } else {
      setPasswordError("");
    }

    if (_isEmpty(otp)) {
      otpErr = true;
      setOtpError("Required");
    } else {
      setOtpError("");
    }

    if (_isEmpty(confirmpass)) {
      confirmpassErr = true;
      setConfirmpassError("Required");
    } else {
      if (confirmpass == password) {
        setConfirmpassError("");
      } else {
        confirmpassErr = true;
        setConfirmpassError("Password did not matched");
      }
    }

    if (passwordErr || otpErr || confirmpassErr) return false;
    return true;
  };

  const _validateEmail = () => {
    let emailErr = false;
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
    if (emailErr) return false;
    return true;
  };

  const _setsendOtp = async () => {
    if (_validateEmail() && step === 1) {
      dispatch(SET_LOADING(true));
      const [res, error] = await otpAPI({ email, type });
      if (res) {
        setStep(2);
        toast.success(res.data.message);
      } else {
        toast.error(error.response.data.message);
      }
      dispatch(SET_LOADING(false));
    } else if (_validate() && step === 2) {
      dispatch(SET_LOADING(true));
      const [res, error] = await forgotpasswordAPI({
        email,
        otp: parseInt(otp),
        password,
        type,
      });
      if (res) {
        toast.success("Password reset successfull");
        setToggle("login");
      } else {
        if (error.response) toast.error(error.response.data.message);
        else toast.error(error.message);
      }
      dispatch(SET_LOADING(false));
    }
  };

  const _resetState = () => {
    setEmail("");
    setPassword("");
    setConfirmpass("");
    setOtp("");
    setStep(1);
    setEmailError("");
    setPasswordError("");
    setConfirmpassError("");
    setOtpError("");
  };

  return (
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
          sx={{ borderRadius: "12px" }}
        >
          <Box
            sx={{
              my: 8,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Forgot password
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  error={!!emailError}
                  value={email}
                  disabled={step === 2}
                  id="email"
                  size="small"
                  label="Email Address"
                  helperText={emailError}
                  name="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {step === 2 ? (
                  <>
                    <TextField
                      margin="normal"
                      required
                      error={!!otpError}
                      type="number"
                      fullWidth
                      value={otp}
                      id="otp"
                      label="Otp"
                      name="name"
                      autoComplete="otp"
                      size="small"
                      helperText={otpError}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      value={password}
                      error={!!passwordError}
                      name="password"
                      size="small"
                      autoComplete="off"
                      label="Password"
                      helperText={passwordError}
                      type="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      value={confirmpass}
                      fullWidth
                      size="small"
                      autoComplete="off"
                      error={!!confirmpassError}
                      helperText={confirmpassError}
                      name="confirm password"
                      label="Confirm password"
                      type="password"
                      id="passwordConfirm"
                      onChange={(e) => setConfirmpass(e.target.value)}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>

              <Button
                // type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={_setsendOtp}
              >
                Submit
              </Button>
              <Link
                onClick={() => {
                  setToggle("login");
                }}
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Go back to Sign In
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ForgetPassword;
