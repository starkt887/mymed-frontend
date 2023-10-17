import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { _isEmpty, _isEmail, _isMobile } from "../../helper/validatiion";
import { useDispatch } from "react-redux";
import { __RESET__, SET_LOADING } from "../../redux/appReducer";
import toast from "react-hot-toast";
import { signUpAPI } from "../../services/AuthService";

function Register({ setToggle, type }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [confirmpassError, setConfirmpassError] = useState("");

  const _validate = () => {
    let passwordErr = false;
    let emailErr = false;
    let mobileErr = false;
    let nameErr = false;
    let countryErr = false;
    let confirmpassErr = false;

    if (_isEmpty(password)) {
      passwordErr = true;
      setPasswordError("Required");
    } else {
      setPasswordError("");
    }
    if (_isEmpty(name)) {
      nameErr = true;
      setNameError("Required");
    } else {
      setNameError("");
    }
    if (_isEmpty(country)) {
      countryErr = true;
      setCountryError("Required");
    } else {
      setCountryError("");
    }
    if (_isEmpty(confirmpass)) {
      confirmpassErr = true;
      setConfirmpassError("Required");
    } else {
      if (confirmpass === password) {
        setConfirmpassError("");
      } else {
        emailErr = true;
        setConfirmpassError("Password did not matched");
      }
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
    if (_isEmpty(mobile)) {
      mobileErr = true;
      setMobileError("Required");
    } else {
      if (_isMobile(`${mobile}`)) {
        setMobileError("");
      } else {
        mobileErr = true;
        setMobileError("Please enter valid mobile number");
      }
    }
    if (
      passwordErr ||
      emailErr ||
      mobileErr ||
      nameErr ||
      confirmpassErr ||
      countryErr
    )
      return false;
    return true;
  };

  const _register = async () => {
    if (_validate()) {
      dispatch(SET_LOADING(true));
      const [res, error] = await signUpAPI({
        name,
        email,
        mobile,
        country,
        password,
        type,
      });
      if (res) {
        toast.success("Registered successfully");
        setToggle("login");
      } else {
        toast.error(error.response.data.message);
      }
      dispatch(SET_LOADING(false));
    }
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
              Register
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
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                error={!!nameError}
                fullWidth
                value={name}
                id="name"
                label="Name"
                name="name"
                size="small"
                helperText={nameError}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                error={!!emailError}
                value={email}
                id="email"
                size="small"
                label="Email Address"
                helperText={emailError}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                error={!!mobileError}
                value={mobile}
                name="mobile"
                helperText={mobileError}
                size="small"
                label="Mobile"
                onChange={(e) => setMobile(e.target.value)}
                id="mobile"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={country}
                error={!!countryError}
                name="country"
                label="Country"
                size="small"
                helperText={countryError}
                id="country"
                onChange={(e) => setCountry(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={password}
                error={!!passwordError}
                name="password"
                size="small"
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
                error={!!confirmpassError}
                helperText={confirmpassError}
                name="confirm password"
                label="Confirm password"
                type="password"
                id="passwordConfirm"
                onChange={(e) => setConfirmpass(e.target.value)}
              />
              <Button
                // type="submit"
                fullWidth
                onClick={_register}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link
                    onClick={() => {
                      setToggle("login");
                    }}
                    style={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    {"Already have an account?"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
