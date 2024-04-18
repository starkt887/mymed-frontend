import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { __RESET__ } from "../../redux/appReducer";
import classes from "./Home.module.css";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ShieldIcon from "@mui/icons-material/Shield";
import PaymentsIcon from "@mui/icons-material/Payments";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import hero from "./../../assets/hero.png";
import areyouadoctor from "./../../assets/are-you-a-doctor.png";
import about from "./../../assets/About.png";
import howwework from "./../../assets/how-we-work.png";
import patientdocconsult from "./../../assets/patient-doctor-consultation.png";
import videoconsultation from "./../../assets/video-consultation.png";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(__RESET__());
  }, []);

  return (
    <Grid container>
      {/* Hero section */}
      <Grid container className={classes.heroContainer}>
        <Grid item xs={12} sm={6}>
          <Typography variant="p" className={classes.heroTitle}>
            Med Repertory
          </Typography>
          <br />
          <Typography variant="p" className={classes.heroSubtitle}>
            The easiest way to see a doctor online
          </Typography>
          <br />
          <Button
            variant="contained"
            color="primary"
            className={classes.featureButton}
            onClick={() => navigate("/auth")}
          >
            Book an Appointment
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.imageContainer}>
          <img src={hero} alt="hero" className={classes.image} />
        </Grid>
      </Grid>

      {/* About section */}
      <Grid container className={classes.aboutContainer}>
        <Grid item xs={12} sm={6} className={classes.imageContainer}>
          <img src={about} alt="hero" className={classes.image} />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.aboutTextContainer}>
          <Typography variant="h2" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Med Repertory is a platform that provides a convenient and secure
            way for patients and doctors to connect online. Our mission is to
            improve access to quality healthcare for everyone, regardless of
            location or mobility.
          </Typography>
          <Typography variant="body1" paragraph>
            We understand that the traditional healthcare system can be
            inefficient and time-consuming. By using our platform, patients can
            easily search and book appointments with doctors online, and doctors
            can provide medical care and consultations from the comfort of their
            own workspace.
          </Typography>
        </Grid>
      </Grid>
      {/*How we work*/}
      <Grid container className={classes.aboutContainer}>
        <Grid item xs={12} sm={6} className={classes.aboutTextContainer}>
          <Typography variant="h2" gutterBottom>
            How We Work
          </Typography>
          <Typography variant="body1" paragraph>
            At Med Repertory, we work with a simple and efficient process to
            ensure the best possible experience for our clients. We start by
            understanding their needs and requirements, and then provide
            customized solutions to meet those needs.
          </Typography>
          <Typography variant="body1" paragraph>
            Our team of experienced professionals work collaboratively to
            deliver high-quality work within the given time frame. We also
            believe in maintaining open communication with our clients
            throughout the project to ensure transparency and satisfaction. Our
            goal is to provide reliable and efficient services to healthcare
            professionals and institutions, helping them achieve their
            objectives and improve patient outcomes.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.imageContainer}>
          <img src={howwework} alt="hero" className={classes.image} />
        </Grid>
      </Grid>

      {/*Consult to Specialist*/}
      <Grid container className={classes.aboutContainer}>
        <Grid item xs={12} sm={6} className={classes.imageContainer}>
          <img src={patientdocconsult} alt="hero" className={classes.image} />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.aboutTextContainer}>
          <Typography variant="h2" gutterBottom>
            Consult Online
          </Typography>
          <Typography variant="body1" paragraph>
            Med Repertory offers a convenient and efficient way to consult with
            medical specialists. Patients can easily search for and connect with
            specialists in their area, or even from remote locations.
          </Typography>
          <Typography variant="body1" paragraph>
            The platform provides a secure and user-friendly interface for
            scheduling appointments, sharing medical records, and communicating
            with the specialist. With Med Repertory, patients can get the care
            they need without the hassle and inconvenience of traditional
            in-person appointments.
          </Typography>
        </Grid>
      </Grid>
      {/*Find Specialist*/}
      <Grid container className={classes.aboutContainer}>
        <Grid item xs={12} sm={6} className={classes.aboutTextContainer}>
          <Typography variant="h2" gutterBottom>
            Find Specialists
          </Typography>
          <Typography variant="body1" paragraph>
            In Med Repertory, finding a specialist has never been easier. Our
            platform allows users to search for medical professionals based on
            their specialty, location, and availability.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're in need of a general practitioner, a cardiologist, or
            a pediatrician, our database of highly qualified specialists is sure
            to have someone who can meet your needs. You can also read reviews
            from other patients and book appointments directly through our
            platform, making the process of finding a specialist convenient and
            hassle-free.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.imageContainer}>
          <img src={videoconsultation} alt="hero" className={classes.image} />
        </Grid>
      </Grid>

      {/* Features section */}
      {/* <Container sx={{ textAlign: "center" }}>
        <Typography variant="h2" gutterBottom>
          Features
        </Typography>
      </Container>
      <Grid container className={classes.featuresContainer} spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.featureItem}>
            {" "}
            <div className={classes.featureIcon}>
              <BookmarkAddIcon fontSize="inherit" />
            </div>
            <Typography variant="h6" className={classes.featureText}>
              Instant Appointment Booking
            </Typography>
            <Typography variant="body1" className={classes.featureDescription}>
              Book appointments with your preferred doctor instantly. Find it
              Book it!
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.featureItem}>
            <div className={classes.featureIcon}>
              <ShieldIcon fontSize="inherit" />
            </div>
            <Typography variant="h6" className={classes.featureText}>
              Secure Video Consultation
            </Typography>
            <Typography variant="body1" className={classes.featureDescription}>
              Have a secure video consultation with your doctor from anywhere.
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.featureItem}>
            <div className={classes.featureIcon}>
              <PaymentsIcon fontSize="inherit" />
            </div>
            <Typography variant="h6" className={classes.featureText}>
              Multiple Payment Options
            </Typography>
            <Typography variant="body1" className={classes.featureDescription}>
              Choose from a variety of payment options to pay for your
              consultation.
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.featureItem}>
            <div className={classes.featureIcon}>
              <SupportAgentIcon fontSize="inherit" />
            </div>
            <Typography variant="h6" className={classes.featureText}>
              24/7 Customter Support
            </Typography>
            <Typography variant="body1" className={classes.featureDescription}>
              Get support from our customer service team any time of the day.
            </Typography>
          </div>
        </Grid>
      </Grid>

      <div className={classes.doctorContainer}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <div className={classes.dfeatureList}>
              <Typography variant="h4" gutterBottom>
                Are you a Doctor?
              </Typography>
              <div className={classes.dfeatureItem}>
                <Typography variant="h6" className={classes.dfeatureText}>
                  Manage your schedule with ease
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.dfeatureDescription}
                >
                  Use our online scheduling tools to manage your appointments,
                  set your availability, and keep track of your patient
                  information.
                </Typography>
              </div>
              <div className={classes.dfeatureItem}>
                <Typography variant="h6" className={classes.dfeatureText}>
                  Grow your practice
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.dfeatureDescription}
                >
                  Reach new patients through our online platform and build your
                  reputation with our patient feedback system.
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                className={classes.dfeatureButton}
                onClick={() => navigate("/auth")}
              >
                Sign up now
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={6} className={classes.imageContainer}>
            <img src={areyouadoctor} alt="Doctor" className={classes.image} />
          </Grid>
        </Grid>
      </div> */}
    </Grid>
  );
};

export default Home;
