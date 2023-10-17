import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { fetchDoctorProfileAPI } from "../../services/profileService";
import { toast } from "react-hot-toast";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const exclution = [
  "id",
  "profilepic",
  "average_rating",
  "blood_group",
  "country_code",
  "createdAt",
  "email_otp",
  "experience",
  "updatedAt",
  "is_email_verified",
  "is_mobile_verified",
  "is_vlink_verified",
  "mobile_otp",
  "license",
  "schedule",
  "vcode",
];

const DoctorDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (id) {
      const [res, error] = await fetchDoctorProfileAPI(id);
      if (res) {
        setDoctorData(res.data.doctor);
      } else {
        toast.error("Server error");
        navigate("/doctors");
      }
    } else {
      navigate("/doctors");
    }
  };

  const humanize = (str) => {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  const goBack = () => {
    navigate("/doctors");
  };

  return (
    <Container sx={{ my: 5, justifyItems: "center" }}>
      <Typography variant="h5" gutterBottom>
        <IconButton color="inherit" onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>{" "}
        Doctor Details
      </Typography>

      {doctorData && (
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={0}
          boxShadow={3}
        >
          <Avatar
            src={doctorData?.profilepic}
            sx={{ width: 200, height: 200, my: 5 }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            {Object.keys(doctorData).map(
              (keyName) =>
                !exclution.includes(keyName) && (
                  <Typography key={keyName} align="center" gutterBottom>
                    <b>{`${humanize(keyName)}`}</b>
                    {` - ${doctorData[keyName] || "N/A"}`}
                  </Typography>
                )
            )}
          </Box>
        </Stack>
      )}
    </Container>
  );
};

export default DoctorDetail;
