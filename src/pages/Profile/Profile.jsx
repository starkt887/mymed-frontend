import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import { profileUpdateAPI } from "../../services/profileService";
import { SET_LOADING } from "../../redux/appReducer";
import toast from "react-hot-toast";
import { UPDATE_USER } from "../../redux/userReducer";
import PersonalTab from "./PersonalTab";
import ReviewsTab from "./ReviewsTab";
import ProfessionalTab from "./ProfessionalTab";
import SchedulerTab from "./SchedulerTab";
import { _sanitizeObject } from "../../helper/manipulation";
import Alert from "@mui/material/Alert";
import { profileChecker } from "../../helper/manipulation";
import { addProfilePicAPI } from "../../services/profileService";
import { isDoctor } from "../../helper/validatiion";
import LinearProgress from "@mui/material/LinearProgress";

const SUPPORTED_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState({});
  const [profilepic, setProfilepic] = useState("");
  const { completion, progress } = profileChecker(user);

  useEffect(() => {
    setProfile(user);
  }, []);

  const handleChange = (e, type) => {
    const data = { ...profile };
    data[e.target.name] =
      type === "number" ? Number(e.target.value) : e.target.value;
    setProfile(data);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfilePic = async (e) => {
    e.preventDefault();

    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("File type not supported");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setProfilepic(reader.result);
      };

      let payload = new FormData();
      payload.append("id", user.id);
      payload.append("role", user.role);
      payload.append("previousUrl", user.profilepic);
      payload.append("file", file);

      const [res, error] = await addProfilePicAPI(payload);
      if (res) {
        const userData = res.data.profile;
        userData.isLoggedIn = true;
        userData.role = profile.role;
        setProfile(userData);
        dispatch(UPDATE_USER(userData));
        toast.success(res.data.message);
      } else {
        if (error.response) {
          toast.error(error.response.data.message || error.response.data);
        } else {
          toast.error("File size limit has been reached");
        }
      }
    }
  };

  const _update = async () => {
    dispatch(SET_LOADING(true));
    const payload = _sanitizeObject(profile);
    const [res, error] = await profileUpdateAPI(payload);
    if (res) {
      const userData = res.data.profile;
      userData.isLoggedIn = true;
      userData.role = profile.role;
      setProfile(userData);
      dispatch(UPDATE_USER(userData));
      toast.success(res.data.message);
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  return (
    <Container sx={{ my: 5 }}>
      {/* Alert */}
      {isDoctor(user.role) && !completion && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Complete Profile Details (Personal, Professional, Scheduler) in-order
          to get recognized
        </Alert>
      )}

      {/* Title */}
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>

      {isDoctor(user.role) && (
        <Box sx={{ boxShadow: 3 }}>
          {/* Tabs */}
          <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Personal" />
              <Tab label="Professional" />
              <Tab label="Reviews" />
              <Tab label="Scheduler" />
            </Tabs>
          </Box>
        </Box>
      )}

      {/* Progress */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Typography variant="button" align="center" gutterBottom>
          Profile Completion
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            color="success"
            variant="determinate"
            value={progress}
            sx={{ height: 5, borderRadius: 15 }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box>
      </Box>
      {/* Progress */}

      {/* Personal Details */}
      <TabPanel value={tabValue} index={0}>
        <PersonalTab
          user={user}
          profile={profile}
          handleChange={handleChange}
          updateProfile={_update}
          handleProfilePic={handleProfilePic}
          profilepic={profilepic}
        />
      </TabPanel>

      {/* Professional Details */}
      <TabPanel value={tabValue} index={1}>
        <ProfessionalTab
          user={user}
          profile={profile}
          handleChange={handleChange}
          updateProfile={_update}
        />
      </TabPanel>

      {/* Review Details */}
      <TabPanel value={tabValue} index={2}>
        <ReviewsTab />
      </TabPanel>

      {/* Scheduler Details */}
      <TabPanel value={tabValue} index={3}>
        <SchedulerTab />
      </TabPanel>
    </Container>
  );
}

export default Profile;
