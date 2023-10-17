import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputField from "../../components/InputField/InputField";
import SearchIcon from "@mui/icons-material/Search";
import DoctorMedicalRecordTable from "../../components/Table/DoctorMedicalRecordTable";
import {
  fetchMedicalRecordsAPI,
  deleteRecordAPI,
} from "../../services/MedicalRecordService";
import { useNavigate } from "react-router-dom";
import { SET_LOADING } from "../../redux/appReducer";
import { useSelector, useDispatch } from "react-redux";
import AlertComponent from "../../components/Alert/Alert";
import toast from "react-hot-toast";

const DoctorMedicalRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      userId: user.id,
      role: "doctors",
    };
    const [res, error] = await fetchMedicalRecordsAPI(payload);
    if (res) {
      setRecords(res.data.records);
      setFilterRecords(res.data.records);
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const deleteRecord = async (id) => {
    if (id) {
      setDeleteRecordId(id);
      setDeleteAlert(true);
    }
  };

  const _deleteRecord = async () => {
    setDeleteAlert(false);
    if (deleteRecordId) {
      dispatch(SET_LOADING(true));
      const [res, error] = await deleteRecordAPI({ recordId: deleteRecordId });
      setDeleteRecordId(null);
      if (res) {
        toast.success(res.data.message);
        _init();
      } else {
        toast.error(error.response.data.message);
      }
      dispatch(SET_LOADING(false));
    }
  };

  const _filter = (word) => {
    setSearchValue(word);
    let filter = records.filter(
      (data) =>
        data["title"].toLowerCase().search(word.toLowerCase()) !== -1 ||
        data.patient["name"].toLowerCase().search(word.toLowerCase()) !== -1
    );
    setFilterRecords(filter);
  };

  return (
    <Container sx={{ my: 5 }}>
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Medical Records</Typography>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate("/record/new")}
        >
          Add New
        </Button>
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <InputField
          label="Search"
          name="search"
          onChange={(e, _) => _filter(e.target.value)}
          value={searchValue}
          startIcon={<SearchIcon />}
          styles={{ width: 250 }}
        />
      </Box>

      {/* Table */}
      <Box sx={{ boxShadow: {xs:0,sm:3}, p: 2, mt: 5 }}>
        <DoctorMedicalRecordTable
          userData={user}
          tableData={filterRecords}
          deleteRecords={deleteRecord}
        />
      </Box>

      {/* Alert */}
      <AlertComponent
        open={deleteAlert}
        onClose={() => setDeleteAlert(false)}
        onSubmit={_deleteRecord}
        title={"Delete Record"}
        description={"Are you sure, you want to delete record ?"}
      />
      {/* Alert */}
    </Container>
  );
};

export default DoctorMedicalRecord;
