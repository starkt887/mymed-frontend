import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PersonIcon from "@mui/icons-material/Person";
import { Grid } from "@mui/material";

function AppointmentCard({ doc, nextStep }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card
        sx={{

          mt: 5,
          borderRadius: 3,
        }}
        elevation={5}
      >
        <Grid container rowSpacing={1} columnSpacing={{ sm: 2, md: 3 }}>
          <Grid item xs={6} sm={4} md={4} px={5} sx={{ display: "flex", justifyContent: "center" }}>

            <Avatar
              sx={{ mx: 5, my: 4, width: 130, height: 130 }}
              alt="Doctor"
              src={doc.profilepic}
            >
              <PersonIcon />
            </Avatar>

          </Grid>
          <Grid item xs={6} sm={4} md={4} px={5} sx={{ display: "flex", justifyContent: "center",mt:{xs:3,sm:0} }}>
            <Box >
              <Typography
               
                sx={{ textAlign: "left", mx: 1, color: "#05AEE6",fontSize:{xs:"16px",sm:"18px"} }}
              >
                {doc.name}
              </Typography>
              <Typography sx={{ textAlign: "left", mx: 1,fontSize:{xs:"14px",sm:"16px"} }}>
                {doc.speciality.charAt(0).toUpperCase() + doc.speciality.slice(1)}
              </Typography>
              <Typography sx={{ textAlign: "left", mx: 1,fontSize:{xs:"14px",sm:"16px"} }}>
                {doc.experience_years + " " + "years of experience"}
              </Typography>
              <Typography sx={{ textAlign: "left", mx: 1,fontSize:{xs:"14px",sm:"16px"} }}>
                {doc.work_city + "," + doc.work_state}
              </Typography>
              <Box sx={{ textAlign: "left", pl: 1 }}>
                <Rating name="read-only" value={doc.average_rating} readOnly />
              </Box>
              <Box sx={{ textAlign: "left", pl: 1 }}>
                <Chip
                  label="Know more"
                  component="a"
                  clickable
                  color="primary"
                  onClick={handleClickOpen}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={4} px={5}>
            <Box sx={{ display: "flex",flexDirection:{xs:"row",sm:"column"}, justifyContent: { xs: "space-between", md: "center" }, my: 3, mx: 1 }} >
              <Typography
                
                color="primary"
                sx={{ textAlign: "left", mx: 1,fontSize:{xs:"20px",sm:"24px"}  }}
               
              >
                <CurrencyRupeeIcon fontSize="small" />
                {doc.fees || 0}
              </Typography>
              <Button
                variant="contained"
                sx={{ py: 1,fontSize:{xs:"10px",sm:"12px"} }}
                onClick={() => nextStep(doc)}
              >
                Book Appointment
                
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ py: 5, mx: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box>
              <Avatar
                sx={{ mx: 5, my: 4, width: 130, height: 130 }}
                alt="Doctor"
                src={doc.profilepic}
              >
                <PersonIcon />
              </Avatar>
            </Box>
            <Box sx={{ flexGrow: 1, my: 2 }}>
              <Typography
                variant="h6"
                sx={{ textAlign: "left", mx: 1, color: "#05AEE6" }}
              >
                {doc.name}
              </Typography>
              <Typography sx={{ textAlign: "left", mx: 1 }}>
                <b>Speciality: </b>
                {doc.speciality.charAt(0).toUpperCase() +
                  doc.speciality.slice(1)}
              </Typography>
              <Typography sx={{ textAlign: "left", mx: 1 }}>
                {doc.experience_years + " " + "years of experience"}
              </Typography>
              <Typography sx={{ textAlign: "left", mx: 1 }}>
                {doc.work_city + ", " + doc.work_state}
              </Typography>
              <Box sx={{ textAlign: "left", pl: 1 }}>
                <Rating name="read-only" value={doc.average_rating} readOnly />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography>
                    <b>Clinic Address:</b>
                  </Typography>
                  <Typography>{doc.clinic_name}</Typography>
                  <Typography>{doc.work_address}</Typography>
                  <Typography>{doc.work_zip_code}</Typography>
                  <Typography>{doc.work_city}</Typography>
                  <Box></Box>
                </Box>
                <Box sx={{ mx: 5 }}>
                  <Typography variant="h3">₹{doc.fees || 0}</Typography>
                  <Button
                    variant="contained"
                    sx={{ py: 1, my: 3 }}
                    onClick={() => nextStep(doc)}
                  >
                    Book Appointment
                  </Button>
                  <Box></Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AppointmentCard;
