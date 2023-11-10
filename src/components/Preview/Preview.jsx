import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Grid, Typography } from "@mui/material";
import prescriptionlogo from "./../../assets/weblogo.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MedicineTable from "../Table/MedicineTable";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState, useEffect } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import QRCode from "react-qr-code";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LanguageIcon from "@mui/icons-material/Language";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { useSelector, useDispatch } from "react-redux";


function Preview({ prescription, locationData }) {
  const { user } = useSelector((state) => state.user);

  const [tests, setTests] = useState([]);
  const [doctor, setDoctor] = useState({
    name: "",
    speciality: "",
    email: "",
    mobile: "",
  });
  const [patient, setPatient] = useState({
    name: "",
    blood_group: "",
    gender: "",
    address: "",
  });
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    _init();
    _QR();
  }, []);

  const _init = () => {
    setTests(prescription.tests);
    setDoctor({
      name: locationData.doctor.name,
      speciality: locationData.doctor.speciality,
      email: locationData.doctor.email,
      mobile: locationData.doctor.mobile,
    });
    setPatient({
      name: locationData.user?.name || user.name,
      blood_group: locationData.user?.blood_group || user.blood_group,
      gender: locationData.user?.gender || user.gender,
      address: locationData.user?.address || user.address,
    });
  };

  const _QR = () => {
    setQrCodeData(
      `Med Repertory\nDoctor - ${locationData.doctor.name}\n Doctor mobile - ${locationData.doctor.mobile
      } \n Doctor email - ${locationData.doctor.email
      }\n\n${prescription.medication
        .map(
          (x, i) =>
            `${i + 1}. Medicine - ${x.name}\n Quantity - ${x.quantity
            } \n  Dosage - ${x.dosage}\n Timing - ${x.timing
            }\n  Intake Time - ${x.specifically}\n Duration (in days) - ${x.duration
            }  \n\n\n`
        )
        .join("")}`
    );
  };

  return (
    <div id="divToPrint">
      <div >
        <Box>
          {/*Heading */}
          <Box sx={{ position: "absolute", px: 2, py: {xs:8,sm:2} }}>
            <img
              src={prescriptionlogo}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Box
              sx={{
                background: "#4328be",
                color: "white",
                py: 6,
                px: 6,
                width: "35%",
                borderBottomLeftRadius: "100px",
                position: "absolute",
                opacity: "0.5",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              // display:{xs:"none",sm:"flex"},
              display:"flex",
              justifyContent: "end",
            }}
          >
            <Box
              sx={{
                background: "#4328be",
                color: "white",
                py: 3,
                px: 3,
            
                borderBottomLeftRadius: "100px",
                zIndex: "1",
              }}
            >
              <Typography
                sx={{ fontSize: 18, letterSpacing: 5 }}
                color="White"
                gutterBottom
                textAlign="right"
              >
                <b>PRESCRIPTION </b>
              </Typography>
            </Box>
          </Box>
          {/*Doctor Profile */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Box
              sx={{
                py: 5,
                px: 5,
                textAlign: "right",
              }}
            >
              <Typography
                sx={{ fontWeight: "900" }}
                variant="h5"
                color="#4328be"
                gutterBottom
              >
                Dr. {doctor.name}
              </Typography>
              <Typography variant="h6" color="#4328be" gutterBottom>
                {doctor.speciality}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/*Information */}
        <Box sx={{ ml: 5 }}>
          <Grid container rowSpacing={1} columnSpacing={{ sm: 0, md: 0 }}>
            <Grid item xs={12} md={6} >
              <Box sx={{ fontSize: 18, pt: { xs: 1, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    color: "#4328be",
                  }}
                >
                  <Typography
                    sx={{ paddingRight: "10px", fontWeight: "bold" }}
                    gutterBottom
                  >
                    Patient Name:
                  </Typography>
                  <Typography gutterBottom sx={{}}>
                    {patient.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    color: "#4328be",
                  }}
                >
                  <Typography
                    sx={{ paddingRight: "10px", fontWeight: "bold" }}
                    gutterBottom
                  >
                    Gender:
                  </Typography>
                  <Typography gutterBottom sx={{}}>
                    {patient.gender}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    color: "#4328be",
                  }}
                >
                  <Typography
                    sx={{ paddingRight: "10px", fontWeight: "bold" }}
                    gutterBottom
                  >
                    Blood Group:
                  </Typography>
                  <Typography gutterBottom sx={{}}>
                    {patient.blood_group}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}  >
              <Box sx={{ fontSize: 18, pt: { xs: 1, sm: 3 } }} >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    color: "#4328be",
                  }}
                >
                  <Typography
                    sx={{ paddingRight: "10px", fontWeight: "bold" }}
                    gutterBottom
                  >
                    Date:
                  </Typography>
                  <Typography gutterBottom sx={{}}>
                    {new Date().toDateString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    color: "#4328be",
                  }}
                >
                  <Typography
                    sx={{ paddingRight: "10px", fontWeight: "bold" }}
                    gutterBottom
                  >
                    Address:
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ maxWidth: "300px", wordWrap: "break-word" }}
                  >
                    {patient.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "#4328be",
            }}
          >


          </Box>
          <div
            style={{ boxShadow: "0px 0 10px #00000052", borderRadius: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                px: 2,
                background: "#4328be",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
              gutterBottom
            >
              Diagnosis
            </Typography>
            {prescription.diagnosis.length > 0 && (
              <Box sx={{ px: 5 }}>
                <List>
                  {prescription.diagnosis?.map((sym, index) => (
                    <ListItem disablePadding key={index}>
                      <Typography sx={{ fontSize: 18 }}>
                        {index + 1 + ". " + sym.name}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                px: 2,
                background: "#4328be",
              }}
              gutterBottom
            >
              Symptoms
            </Typography>
            {prescription.symptoms.length > 0 && (
              <Box sx={{ px: 5 }}>
                <List>
                  {prescription.symptoms?.map((diag, index) => (
                    <ListItem disablePadding key={index}>
                      <Typography sx={{ fontSize: 18 }}>
                        {index + 1 + ". " + diag.name}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </div>

          <Box
            sx={{
              justifyContent: "center",
              boxShadow: "0px 0 10px #00000052",
              borderRadius: "10px",
              mt: 5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                px: 2,

                background: "#4328be",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
              gutterBottom
            >
              Medicines
            </Typography>
            <MedicineTable tableData={prescription.medication} />
          </Box>
          {prescription.tests.length > 0 && (
            <Box
              sx={{
                justifyContent: "center",
                boxShadow: "0px 0 10px #00000052",
                borderRadius: "10px",
                mt: 5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  px: 2,

                  background: "#4328be",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
                gutterBottom
              >
                Further Tests
              </Typography>
              <Box sx={{ px: 5 }}>
                <List>
                  {tests?.map((test, index) => (
                    <ListItem disablePadding key={index}>
                      <Typography sx={{ mt: 1 }}>
                        {index + 1 + ". " + test.name}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
          {prescription.instructions && (
            <Box
              sx={{
                justifyContent: "center",
                boxShadow: "0px 0 10px #00000052",
                borderRadius: "10px",
                mt: 5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  px: 2,
                  mt: 5,
                  background: "#4328be",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
                gutterBottom
              >
                Instructions
              </Typography>
              <Typography sx={{ px: 5, py: 2, fontSize: 18 }} gutterBottom>
                {prescription.instructions}
              </Typography>
            </Box>
          )}
        </Box>
        {/*Doctor Signature */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Box
            sx={{
              py: 2,
              px: 5,
              textAlign: "right",
            }}
          >
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: 18,
                textDecoration: "underline",
              }}
              color="#4328be"
              gutterBottom
            >
              Dr. {doctor.name}
            </Typography>
            <Typography sx={{ fontSize: 16 }} color="#4328be" gutterBottom>
              Signature
            </Typography>
          </Box>
        </Box>

        <Box>
          {/*Footer */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
            }}
          >

            <Box
              sx={{
                background: "#4328be",
                color: "white",
                py: 2,
                px: 5,
                width: "80%",
                borderTopRightRadius: "100px",
                zIndex: "1",
              }}
            >

              <QRCode
                style={{
                  height: "auto",
                  maxWidth: "100px",
                  width: "100%",
                  marginRight: "10px",
                }}
                value={qrCodeData}
              />

              <Box>
                <Grid container rowSpacing={1} columnSpacing={{ sm: 0, md: 0 }}>
                  <Grid item xs={12} sm={6} md={6} >
                    <PhoneAndroidIcon />
                    <Typography
                      sx={{
                        color: "#fff",
                        fontStyle: "italic",
                        fontSize: 15,
                        paddingRight: 5,
                      }}
                      variant="p"
                    >
                      {doctor.mobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} >
                    <LanguageIcon />
                    <Typography
                      sx={{
                        color: "#fff",
                        fontStyle: "italic",
                        fontSize: 15,
                        paddingRight: 5,
                      }}
                      variant="p"
                    >
                      https://medrepertory.com
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ sm: 0, md: 0 }}>
                  <Grid item xs={12} sm={6} md={6} >
                    <EmailIcon />
                    <Typography
                      sx={{
                        color: "#fff",
                        fontStyle: "italic",
                        fontSize: 15,
                        paddingRight: 5,
                      }}
                      variant="p"
                    >
                      support@medrepertory.com
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} >
                    <FmdGoodIcon />
                    <Typography
                      sx={{
                        color: "#fff",
                        fontStyle: "italic",
                        fontSize: 15,
                        paddingRight: 5,
                      }}
                      variant="p"
                    >
                      Mumbai
                    </Typography>
                  </Grid>
                </Grid>

              </Box>

            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default Preview;
{
  /* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "#80b3ff",
            mt: 1,
            p: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <LocalPhoneIcon />
            <Typography sx={{ mx: 1 }}>{doctor.mobile}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <EmailIcon />
            <Typography sx={{ mx: 1 }}>{doctor.email}</Typography>
          </Box>
        </Box> */
}

