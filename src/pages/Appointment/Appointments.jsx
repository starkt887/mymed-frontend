import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AppointmentTable from "../../components/Table/AppointmentTable";
import { fetchAppointmentAPI } from "../../services/appointmentService";
import { SET_LOADING } from "../../redux/appReducer";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import InputField from "../../components/InputField/InputField";
import { isDoctor } from "../../helper/validatiion";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Appointments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [newAppointments, setNewAppointments] = useState([]);
  const [oldAppointments, setOldAppointments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    _init();
    return () => {
      setTabValue(0);
    };
  }, []);

  const _init = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      field: user.role === "DOCTOR" ? "doctorId" : "userId",
      id: user.id,
      type: user.role === "DOCTOR" ? "user" : "doctor",
    };
    const [res, error] = await fetchAppointmentAPI(payload);
    if (!error) {
      manipulate(res.data.appointments);
    }
    dispatch(SET_LOADING(false));
  };

  const manipulate = (appointments) => {
    const newAppointment = [];
    const oldAppointment = appointments.filter((app) => {
      const diff = dayjs().diff(app.date, "day");
      if (diff > 1) {
        return app;
      } else {
        newAppointment.push(app);
      }
    });
    setFilterData(newAppointment);
    setNewAppointments(newAppointment);
    setOldAppointments(oldAppointment);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchValue("");
    if (newValue === 0) {
      setFilterData(newAppointments);
    } else if (newValue === 1) {
      setFilterData(oldAppointments);
    }
  };

  const _filter = (word) => {
    setSearchValue(word);
    const list = tabValue === 0 ? newAppointments : oldAppointments;
    let filter = list.filter((data) => {
      if (isDoctor(user.role)) {
        return (
          data.user["name"].toLowerCase().search(word.toLowerCase()) !== -1 ||
          dayjs(data.date)
            .format("MMM D, YYYY")
            .toLowerCase()
            .search(word.toLowerCase()) !== -1
        );
      } else {
        return (
          data.doctor["name"].toLowerCase().search(word.toLowerCase()) !== -1 ||
          dayjs(data.date)
            .format("MMM D, YYYY")
            .toLowerCase()
            .search(word.toLowerCase()) !== -1
        );
      }
    });
    setFilterData(filter);
  };

  return (
    <Container sx={{ my: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Appointments
        </Typography>
        <InputField
          label="Search"
          name="search"
          onChange={(e, _) => _filter(e.target.value)}
          value={searchValue}
          startIcon={<SearchIcon />}
          placeholder={
            isDoctor(user.role) ? "Patient Name/ Date" : "Doctor Name/ Date"
          }
          styles={{ width: 250 }}
        />
      </Box>
      <Box sx={{ boxShadow: {xs:0,sm:3}, p: 2, mt: 5 }}>
        <Box sx={{ width: "100%" }}>
          {/* TABS */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Appointment" />
              <Tab label="Old Request" />
            </Tabs>
          </Box>

          {/* TAB 1 */}
          <TabPanel value={tabValue} index={0}>
            <AppointmentTable
              type={user.role === "DOCTOR" ? "user" : "doctor"}
              tableData={filterData}
            />
          </TabPanel>

          {/* TAB 2 */}
          <TabPanel value={tabValue} index={1}>
            <AppointmentTable
              type={user.role === "DOCTOR" ? "user" : "doctor"}
              tableData={filterData}
            />
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
};

export default Appointments;
