import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import UserTable from "../../components/Table/UserTable";
import InputField from "../../components/InputField/InputField";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAppointmentAPI } from "../../services/appointmentService";
import { SET_LOADING } from "../../redux/appReducer";
import { useSelector, useDispatch } from "react-redux";

const MyUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [userData, setUserData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    dispatch(SET_LOADING(true));
    const data = [];
    const type = user.role === "DOCTOR" ? "user" : "doctor";
    const payload = {
      field: user.role === "DOCTOR" ? "doctorId" : "userId",
      id: user.id,
      type,
    };
    const [res, error] = await fetchAppointmentAPI(payload);
    if (res && res.data) {
      const appointments = res.data.appointments;
      for (let i = 0; i < appointments.length; i++) {
        const found = data.find((x) => x.id === appointments[i][type].id);
        if (!found) {
          data.push(appointments[i][type]);
        }
      }
      setUserData(data);
      setFilterData(data);
    }
    dispatch(SET_LOADING(false));
  };

  const _filter = (word) => {
    setSearchValue(word);
    let filter = userData.filter(
      (data) => data["name"].toLowerCase().search(word.toLowerCase()) !== -1
    );
    setFilterData(filter);
  };

  return (
    <Container
      sx={{ my: 5 }}
      // maxWidth={false}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          {user.role === "DOCTOR" ? "My Patients" : "My Doctors"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <InputField
            label="Search"
            name="search"
            onChange={(e, _) => _filter(e.target.value)}
            value={searchValue}
            startIcon={<SearchIcon />}
          />
        </Box>
      </Box>

      <Box sx={{ boxShadow: {xs:0,sm:3}, p: 2, mt: 5 }}>
        <UserTable user={user} tableData={filterData} />
      </Box>
    </Container>
  );
};

export default MyUser;
