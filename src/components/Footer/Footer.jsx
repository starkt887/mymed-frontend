import React from "react";
import classes from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";
import weblogo from "../../assets/weblogo.png";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className={classes.footerContainer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              <img src={weblogo} />
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              className={classes.description}
            >
              Med Repertory is a platform that helps patients find and book
              appointments with doctors, and helps doctors manage their
              schedules and patient information.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              <b> Browse</b>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="#" className={classes.link}>
                Home
              </Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="#" className={classes.link}>
                About
              </Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="#" className={classes.link}>
                Contact
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              <b> Policies</b>
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              onClick={() => navigate("/privacy-policy")}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              onClick={() => navigate("/terms-conditions")}
            >
              Terms & Conditions
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              <b>Contact Us</b>
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              className={classes.description}
            >
              123 Main Street, Anytown USA 12345
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b> Phone:</b>
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              className={classes.description}
            >
              555-555-5555
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b> Email:</b>
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              className={classes.description}
            >
              info@company.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}

export default Footer;
