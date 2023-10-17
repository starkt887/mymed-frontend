import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import InputField from "../../components/InputField/InputField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import AppointmentCard from "../../components/Card/AppointmentCard";
import Container from "@mui/material/Container";
import { findDoctorAPI } from "../../services/appointmentService";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import PatientBookingDetail from "./PatientBookingDetail";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkout from "./Checkout";
import { miscellaneousAPI } from "../../services/prescriptionService";

const steps = ["Find Doctor", "Book Appointment", "Checkout"];

function BookAppointment() {
  const [activeStep, setActiveStep] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [doctorData, setDoctorData] = useState({});
  const [geolocation, setGeolocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [speciality, setSpeciality] = useState("");
  const [appointmentData, setappointmentData] = useState({});
  const [specialityDropDown, setSpecialityDropDown] = useState([]);

  useEffect(() => {
    _init();
    return () => {
      _reset();
    };
  }, []);

  useEffect(() => {
    setDoctors([]);
    const getData = setTimeout(() => {
      findDoctors(searchValue);
    }, 500);
    return () => clearTimeout(getData);
  }, [searchValue]);

  const _init = async () => {
    findDoctors("");
    const [res, error] = await miscellaneousAPI();
    if (!error) {
      setSpecialityDropDown(res.data.info.specialities);
    }
  };

  const findDoctors = async (searchQuery) => {
    setCurrentPage(1);
    const [res, error] = await findDoctorAPI({
      searchQuery,
      page: currentPage,
      itemsPerPage,
    });
    if (!error) {
      setDoctors(res.data.doctors);
      setTotalPages(res.data.totalPages);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (e, type) => {
    setSearchValue(e.target.value);
  };

  const handleSpecialityChange = (event) => {
    const selectedSpeciality = event.target.value;
    setSpeciality(event.target.value);
    findDoctors(selectedSpeciality);
  };

  const nextStep = (data) => {
    if (activeStep === 0) setDoctorData(data);
    setActiveStep(activeStep + 1);
  };

  const goBack = () => {
    if (activeStep === 1) setDoctorData({});
    setActiveStep(activeStep - 1);
  };

  const _reset = () => {
    setActiveStep(0);
    setDoctors([]);
    setSearchValue("");
    setDoctorData({});
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => toast.error("Enable geolocation permission")
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  return (
    <Container sx={{ my: 5 }}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 5,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Find and Book
            </Typography>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Speciality</InputLabel>
              <Select
                value={speciality}
                label="Speciality"
                onChange={handleSpecialityChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {specialityDropDown?.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            spacing={2}
          >
            <Tooltip title="Get Location">
              <IconButton size="large" onClick={getLocation}>
                <LocationOnIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <InputField
              startIcon={<SearchIcon />}
              onChange={handleSearch}
              value={searchValue}
              placeholder={"Search doctors,clinics,hospital,place,etc."}
            />
          </Stack>
          {doctors &&
            doctors.length > 0 &&
            doctors.map((doc) => (
              <AppointmentCard key={doc.id} doc={doc} nextStep={nextStep} />
            ))}
          {doctors.length === 0 && (
            <Typography
              variant="h6"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 5,
              }}
            >
              <ErrorOutlineIcon sx={{ mr: 1 }} /> No Result Found
            </Typography>
          )}
          {doctors.length !== 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 5,
              }}
            >
              <Pagination
                count={totalPages}
                variant="outlined"
                color="primary"
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}

      {activeStep === 1 && (
        <PatientBookingDetail
          doctor={doctorData}
          goBack={goBack}
          nextStep={nextStep}
          initAappointmentData={(data) => {
            setappointmentData(data);
          }}
        />
      )}

      {activeStep === 2 && (
        <Checkout
          doctor={doctorData}
          goBack={goBack}
          appointmentData={appointmentData}
        />
      )}
    </Container>
  );
}

export default BookAppointment;
