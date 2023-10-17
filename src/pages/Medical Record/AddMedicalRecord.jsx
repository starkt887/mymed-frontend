import { useState, useEffect, useRef } from "react";
import { Box, Autocomplete } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputField from "../../components/InputField/InputField";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAppointmentAPI } from "../../services/appointmentService";
import { SET_LOADING } from "../../redux/appReducer";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { _isEmpty } from "../../helper/validatiion";
import toast from "react-hot-toast";
import {
  addRecordAPI,
  updateRecordAPI,
  fetchRecordByAPI,
} from "../../services/MedicalRecordService";
import dayjs from "dayjs";
import { sendNotificationAPI } from "../../services/NotificationService";
import {
  notificationSender,
  notificationSubjects,
  notificationMessages,
  messageModifier,
} from "../../helper/appointment";

const AddMedicalRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [patientData, setPatientData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [recordOwner, setRecordOwner] = useState(false);
  const [newRecord, setNewRecord] = useState(true);

  // Doctor
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [recordTitle, setRecordTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (params.id) {
      if (location && location.state) {
        _setRecordState(location.state);
      } else {
        _fetchRecord();
      }
    } else {
      _init();
    }
  }, []);

  const _fetchRecord = async () => {
    dispatch(SET_LOADING(true));
    const [res, error] = await fetchRecordByAPI({ recordId: params.id });
    if (res) {
      _setRecordState(res.data.record);
    } else {
      navigate("/record");
    }
    dispatch(SET_LOADING(false));
  };

  const _setRecordState = (record) => {
    setNewRecord(false);
    setRecordOwner(user.id === record.createdBy);
    setRecordId(record.id);
    setSelectedPatient(record.patient);
    setRecordTitle(record.title);
    setDescription(record.description);
    setTags(record.tags);
    setDocument(record.file);
    const file = record.file;
    const fileExt = file.substr(file.lastIndexOf(".") + 1);
    if (fileExt === "pdf") setDocumentType("pdf");
    else setDocumentType("image");
  };

  const _init = async () => {
    setSelectedPatient(null);
    setRecordOwner(true);
    dispatch(SET_LOADING(true));
    const data = [];
    const type = "user";
    const payload = {
      field: "doctorId",
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
      setPatientData(data);
      setFilterData(data);
    }
    dispatch(SET_LOADING(false));
  };

  const _validate = () => {
    let titleErr = false;
    let fileErr = false;

    if (_isEmpty(recordTitle)) {
      titleErr = true;
      setTitleError("Required");
    } else {
      setTitleError("");
    }

    if (_isEmpty(document)) {
      fileErr = true;
      setFileError("Required");
    } else {
      setFileError("");
    }

    if (titleErr || fileErr) return false;
    return true;
  };

  const _filter = (word) => {
    setSearchValue(word);
    let filter = patientData.filter(
      (data) => data["name"].toLowerCase().search(word.toLowerCase()) !== -1
    );
    setFilterData(filter);
  };

  const handleTags = (_, data) => {
    const value = data.filter((x) => x.trim() !== "");
    setTags(value);
  };

  const openImageSelector = () => {
    inputRef.current.click();
  };

  const handleDocument = async (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      setDocumentFile(file);
      _setDocumentType(file.name);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setDocument(reader.result);
      };
    }
  };

  const _setDocumentType = (file) => {
    if (file) {
      if (file.match(/\.(pdf)$/i)) {
        setDocumentType("pdf");
      } else {
        setDocumentType("image");
      }
    }
  };

  const addRecord = async () => {
    if (_validate()) {
      let payload = new FormData();
      payload.append("title", recordTitle);
      payload.append("type", "Individual");
      payload.append("tokenstr", "noto");
      payload.append("tags", JSON.stringify(tags));
      payload.append("recordLink", JSON.stringify([]));
      payload.append("patientId", selectedPatient.id);
      payload.append("userId", user.id);
      payload.append("role", "doctors");
      payload.append("description", description);
      payload.append("file", documentFile);
      dispatch(SET_LOADING(true));
      const [res, error] = await addRecordAPI(payload);
      if (res) {
        toast.success(res.data.message);
        navigate("/record");
      } else {
        if (error.response) {
          toast.error(error.response.data.message || error.response.data);
          // Notification
          await sendNotificationAPI({
            from: notificationSender(user),
            to: selectedPatient.id,
            subject: notificationSubjects.medicalRecordShare,
            message: messageModifier(
              notificationMessages.medicalRecordShare,
              recordTitle,
              user.name,
              dayjs().format("MMM D, YYYY")
            ),
          });
        } else {
          toast.error("File size limit has been reached");
        }
      }
      dispatch(SET_LOADING(false));
    }
  };

  const updateRecord = async (tokenstr = "noto") => {
    let payload = new FormData();
    payload.append("title", recordTitle);
    payload.append("type", "Individual");
    payload.append("tags", JSON.stringify(tags));
    payload.append("tokenstr", tokenstr);
    payload.append("recordLink", JSON.stringify([]));
    payload.append("recordId", recordId);
    payload.append("description", description);
    if (documentFile) {
      payload.append("file", documentFile);
      payload.append("previousFileUrl", document);
    }
    if (_validate()) {
      dispatch(SET_LOADING(true));
      const [res, error] = await updateRecordAPI(payload);
      if (res) {
        toast.success(res.data.message);
        navigate("/record");
      } else {
        if (error.response) {
          toast.error(error.response.data.message || error.response.data);
        } else {
          toast.error("File size limit has been reached");
        }
      }
      dispatch(SET_LOADING(false));
    }
  };

  const goBack = () => {
    navigate("/record");
  };

  const PatientTable = ({ user, tableData }) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell align="right">Select</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData?.map((row) => (
          <TableRow key={row.id}>
            <TableCell sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={row.profilepic} sx={{ mr: 1 }}>
                <PersonIcon />
              </Avatar>
              {row.name}
            </TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell align="right">
              <IconButton
                color="primary"
                onClick={() => setSelectedPatient(row)}
              >
                <DoneOutlineIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Container sx={{ my: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          <IconButton color="inherit" onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
          {selectedPatient ? "Record Details" : "Select Patient"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!selectedPatient && (
            <InputField
              label="Search"
              name="search"
              onChange={(e, _) => _filter(e.target.value)}
              value={searchValue}
              startIcon={<SearchIcon />}
            />
          )}
        </Box>
      </Box>

      {/* Patient List */}
      {!selectedPatient && (
        <Box sx={{ boxShadow: 3, p: 2, mt: 5 }}>
          <PatientTable user={user} tableData={filterData} />
        </Box>
      )}

      {/* Medical Report */}
      {selectedPatient && (
        <>
          {/* Patient Detail */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 5 }}>
            <Avatar src={selectedPatient.profilepic} sx={{ mr: 1 }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="subtitle1">{selectedPatient.name}</Typography>
          </Box>

          <Box>
            {/* Title */}
            <InputField
              label="Record Title"
              name="title"
              onChange={(e) => setRecordTitle(e.target.value)}
              helperText={titleError}
              value={recordTitle}
              disabled={!recordOwner}
            />

            {/* Tags */}
            <Autocomplete
              multiple
              options={[]}
              value={tags}
              onChange={handleTags}
              freeSolo
              disabled={!recordOwner}
              sx={{ my: 3 }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Tags"
                  size="small"
                />
              )}
            />

            {/* Description */}
            <InputField
              label="Description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              // helperText={titleError}
              value={description}
              multiline={true}
              disabled={!recordOwner}
            />

            {/* Document Upload */}
            <Box>
              <Stack spacing={1} justifyContent="left" alignItems="left">
                <Alert severity="info">
                  Image | PDF Accepted — Maximum upload size 5mb
                </Alert>

                {document && recordOwner && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={openImageSelector}
                  >
                    Change File
                  </Button>
                )}
                {documentType === "image" ? (
                  <Avatar
                    alt="Document"
                    src={document}
                    sx={{ width: "100%", height: "100%" }}
                    variant="rounded"
                    onClick={recordOwner ? openImageSelector : null}
                  >
                    <UploadFileIcon />
                  </Avatar>
                ) : documentType === "pdf" ? (
                  <object
                    data={document}
                    type="application/pdf"
                    width="100%"
                    height="800"
                  ></object>
                ) : (
                  <>
                    <UploadFileIcon
                      sx={{ mt: 3 }}
                      style={{
                        color: "#FFBF00",
                        fontSize: "130",
                        cursor: "pointer",
                      }}
                      onClick={openImageSelector}
                    />
                    <Typography
                      variant="subtitle1"
                      color={fileError ? "error" : ""}
                    >
                      &#x26A0; Upload Document
                    </Typography>
                  </>
                )}
                <input
                  accept="image/*,.pdf"
                  type="file"
                  ref={inputRef}
                  hidden={true}
                  onChange={handleDocument}
                />
              </Stack>
            </Box>

            {/* Save Button */}
            {recordOwner && (
              <Button
                variant="contained"
                sx={{ my: 5 }}
                onClick={newRecord ? addRecord : updateRecord}
              >
                Save
              </Button>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default AddMedicalRecord;
