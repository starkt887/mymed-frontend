import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { SET_LOADING } from "../../redux/appReducer";
import PrescriptionTable from "../../components/Table/PrescriptionTable";
import { fetchPrescriptionsAPI } from "../../services/prescriptionService";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputField from "../../components/InputField/InputField";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { isDoctor } from "../../helper/validatiion";

function Prescription() {
  const [appointments, setAppointments] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      field: user.role === "DOCTOR" ? "doctorId" : "userId",
      id: user.id,
      type: user.role === "DOCTOR" ? "user" : "doctor",
    };
    const [res, error] = await fetchPrescriptionsAPI(payload);
    if (!error) {
      setAppointments(res.data.appointments);
      setFilterData(res.data.appointments);
    }
    dispatch(SET_LOADING(false));
  };

  const _filter = (word) => {
    setSearchValue(word);
    let filter = appointments.filter((data) => {
      if (user.role === "DOCTOR") {
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
          Prescription
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
        <PrescriptionTable user={user} tableData={filterData} />
      </Box>
    </Container>
  );
}

export default Prescription;
