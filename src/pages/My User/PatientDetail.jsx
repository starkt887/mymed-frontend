import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import MedicalHistory from "./MedicalHistory";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const exclution = ["id", "profilepic"];

const PatientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (location && location.state) {
      setPatientData(location.state);
    } else {
      // DB CALL
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
    navigate("/patients");
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h5" gutterBottom>
        <IconButton color="inherit" onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>{" "}
        {patientData?.name || "Patient"}
      </Typography>

      {patientData && (
        <Box sx={{ boxShadow: 3, p: 2, mt: 5 }}>
          <Box sx={{ width: "100%" }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                <Tab label="Information" />
                <Tab label="Medical History" />
              </Tabs>
            </Box>

            {/* Patient Detail */}
            <TabPanel value={tabValue} index={0}>
              <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={0}
              >
                <Avatar
                  src={patientData?.profilepic}
                  sx={{ width: 200, height: 200, mb: 3 }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  {Object.keys(patientData).map(
                    (keyName) =>
                      !exclution.includes(keyName) && (
                        <Typography
                          key={keyName}
                          variant="h6"
                          align="center"
                          gutterBottom
                        >
                          {`${humanize(keyName)} - ${
                            patientData[keyName] || "N/A"
                          }`}
                        </Typography>
                      )
                  )}
                </Box>
              </Stack>
            </TabPanel>

            {/* Medical History */}
            <TabPanel value={tabValue} index={1}>
              <MedicalHistory patientData={patientData} />
            </TabPanel>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PatientDetail;
