import React from "react";
import InputField from "../../components/InputField/InputField";
import { Box, Autocomplete } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { _isEmpty, _isEmail, _isMobile } from "../../helper/validatiion";
import Stack from "@mui/material/Stack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Typography from "@mui/material/Typography";
import {
  addRecordAPI,
  updateRecordAPI,
  fetchMedicalRecordsAPI,
} from "../../services/MedicalRecordService";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { SET_LOADING } from "../../redux/appReducer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoIcon from "@mui/icons-material/Info";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

//chain
import { useWeb3Modal, Web3Button } from "@web3modal/react";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import MediRecords from "./../../blockchain/MediRecords.json";

function MedicalRecordDetail() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [record, setRecord] = useState("Individual");
  const [recordData, setRecordData] = useState({});
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");
  const [description, setDescription] = useState(null);
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [treatmentIds, setTreatmentIds] = useState([]);
  const [typeError, setTypeError] = useState("");
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const [recordOwner, setRecordOwner] = useState(false);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (!location.pathname.includes("new-record")) {
      if (location && location.state) {
        setRecordOwner(user.id === location.state.createdBy);
        setRecordData(location.state);
        setTitle(location.state.title);
        setRecord(location.state.type);
        setTreatmentIds(location.state.recordLink);
        setDocument(location.state.file);
        setTags(location.state.tags);
        setDescription(location.state.description);
        const file = location.state.file;
        const fileExt = file.substr(file.lastIndexOf(".") + 1);
        if (fileExt === "pdf") setDocumentType("pdf");
        else setDocumentType("image");
        if (location.state.type === "Treatment") fetchAllRecords();
      } else {
        alert("DB CALL");
        // DB CALL
      }
    } else {
      setRecordOwner(true);
    }
  };

  const fetchAllRecords = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      userId: user.id,
      patientId: user.id,
      role: user.role === "DOCTOR" ? "doctors" : "users",
    };
    const [res, error] = await fetchMedicalRecordsAPI(payload);
    if (res) {
      setFetchedRecords(res.data.records);
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const handleRecord = (event) => {
    const type = event.target.value;
    setRecord(type);
    if (type === "Treatment" && fetchedRecords.length === 0) fetchAllRecords();
  };

  const handleTitle = (e, type) => {
    setTitle(e.target.value);
  };

  const handleChangeTreatment = (event) => {
    const {
      target: { value },
    } = event;
    setTreatmentIds(typeof value === "string" ? value.split(",") : value);
  };

  const _validate = () => {
    let titleErr = false;
    let fileErr = false;
    let typeErr = false;

    if (_isEmpty(title)) {
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

    if (record === "Treatment") {
      if (treatmentIds.length < 1) {
        typeErr = true;
        setTypeError("Required");
      } else {
        setTypeError("");
      }
    }

    if (titleErr || fileErr || typeErr) return false;
    return true;
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
    let payload = new FormData();
    payload.append("title", title);
    payload.append("type", record);
    payload.append("tokenstr", "noto");
    payload.append("tags", JSON.stringify(tags));
    payload.append(
      "recordLink",
      record === "Individual"
        ? JSON.stringify([])
        : JSON.stringify(treatmentIds)
    );
    payload.append("patientId", user.id);
    payload.append("userId", user.id);
    payload.append("role", user.role === "USER" ? "users" : "doctors");
    payload.append("description", "");
    payload.append("file", documentFile);
    if (_validate()) {
      dispatch(SET_LOADING(true));
      const [res, error] = await addRecordAPI(payload);
      if (res) {
        toast.success(res.data.message);
        setESFile(res.data.record.file);
        setRecordData(res.data.record);
        //navigate(-1);
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

  const updateRecord = async (tokenstr = "noto") => {
    let payload = new FormData();
    payload.append("title", title);
    payload.append("type", record);
    payload.append("tags", JSON.stringify(tags));
    payload.append("tokenstr", tokenstr);
    payload.append(
      "recordLink",
      record === "Individual"
        ? JSON.stringify([])
        : JSON.stringify(treatmentIds)
    );
    payload.append("recordId", recordData.id);
    payload.append("description", "");
    if (documentFile) {
      payload.append("file", documentFile);
      payload.append("previousFileUrl", recordData.file);
    }
    if (_validate()) {
      dispatch(SET_LOADING(true));
      const [res, error] = await updateRecordAPI(payload);
      if (res) {
        dispatch(SET_LOADING(false));
        setESFile(res.data.record.file);
        toast.success(res.data.message);
        //navigate(-1);
      } else {
        dispatch(SET_LOADING(false));
        if (error.response) {
          toast.error(error.response.data.message || error.response.data);
        } else {
          toast.error("File size limit has been reached");
        }
      }
    }
  };
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  //chain
  const [ESFile, setESFile] = useState(undefined);
  const [waitTime, setwaitTime] = useState(0);
  const { isOpen, open, close } = useWeb3Modal();
  const { address, isConnected, isDisconnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });

  const encryp_save = () => {
    if (ESFile) {
      dispatch(SET_LOADING(true));
      write();
    } else {
      toast.error("wait for 30 seconds and try again!");
    }
  };

  const { config } = usePrepareContractWrite({
    address: "0xe5053fdd872a681302485617d46a0552d5c445f5",
    abi: MediRecords.abi,
    functionName: "mint_nemwNFT_single",
    args: [ESFile],
  });
  const { data, write } = useContractWrite({
    ...config,
    onError(err) {
      console.log("Error", err);
      dispatch(SET_LOADING(false));
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
    onSuccess(data) {
      console.log("Success", data);
    },
    onMutate({ args, overrides }) {
      console.log("Mutate", { args, overrides });
    },
  });

  useContractEvent({
    address: "0xe5053fdd872a681302485617d46a0552d5c445f5",
    abi: MediRecords.abi,
    eventName: "MintNFT_single",
    listener(date, collectionAddr, from, tokenid) {
      setESFile(undefined);
      dispatch(SET_LOADING(false));
      updateRecord(
        "https://mumbai.polygonscan.com/token/" +
          collectionAddr +
          "?a=" +
          tokenid.toString()
      );
    },
  });

  const handleTags = (_, data) => {
    const value = data.filter((x) => x.trim() !== "");
    setTags(value);
  };

  const goBack = () => {
    navigate("/record");
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h5" gutterBottom>
        <IconButton color="inherit" onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>{" "}
        {recordData.id ? "View Record" : "Add Record"}
      </Typography>
      <Grid container spacing={2} columns={16}>
        {/* Title */}
        <Grid item xs={8}>
          <InputField
            label="Title"
            name="Title"
            onChange={handleTitle}
            helperText={titleError}
            value={title}
            disabled={!recordOwner}
          />

          <Box sx={{ my: 2 }}></Box>
        </Grid>

        {/* Record Type */}
        <Grid item xs={8}>
          <FormControl fullWidth sx={{ mt: 2 }} disabled={!recordOwner}>
            <InputLabel>Select Type</InputLabel>
            <Select
              value={record}
              size="small"
              label="Select Type"
              onChange={handleRecord}
            >
              <MenuItem value={"Individual"}>Individual</MenuItem>
              <MenuItem value={"Treatment"}>Treatment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Record Linkage */}
      {fetchedRecords.length > 0 && (
        <FormControl
          fullWidth
          sx={{ mb: 2 }}
          size="small"
          disabled={!recordOwner}
        >
          <InputLabel>Select Records</InputLabel>
          <Select
            multiple
            value={treatmentIds}
            onChange={handleChangeTreatment}
            input={<OutlinedInput label="Select Records" />}
            renderValue={(selected) => selected.join(", ")}
            error={typeError ? true : false}
          >
            {fetchedRecords.map((list) => (
              <MenuItem key={list.id} value={list.id}>
                <Checkbox checked={treatmentIds.indexOf(list.id) > -1} />
                <ListItemText primary={list.title} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText sx={{ color: "#d32f2f" }}>{typeError}</FormHelperText>
        </FormControl>
      )}

      {/* Tags */}
      <Autocomplete
        multiple
        options={[]}
        value={tags}
        onChange={handleTags}
        freeSolo
        disabled={!recordOwner}
        sx={{ mb: 2 }}
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
          <TextField {...params} label="Tags" placeholder="Tags" size="small" />
        )}
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
              <Typography variant="subtitle1" color={fileError ? "error" : ""}>
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
      {/* Description */}
      {description && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6">Description:</Typography>
          <Typography variant="subtitle1">{description}</Typography>
        </Box>
      )}
      <Box>
        {" "}
        {ESFile ? (
          isConnected ? (
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Button
                  onClick={() => {
                    encryp_save();
                  }}
                  variant="contained"
                  sx={{
                    py: 1,
                    my: 2,
                    mx: 2,

                    fontWeight: "bold",
                    background: "#332094",
                    borderRadius: "10px",
                  }}
                  disabled={!recordOwner}
                >
                  Encrypt it
                </Button>
              </Grid>
              <Grid item>
                <p className="text-light mt-2">
                  <InfoIcon /> Please click on Encrypt to encrypt and save the
                  file.
                </p>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Web3Button label="Connet Wallet" icon="show" />
              </Grid>
              <Grid item>
                <p className="text-light mt-2">
                  <InfoIcon /> Please Connect your Digital Wallet to save data
                  with encryption.
                </p>
              </Grid>
            </Grid>
          )
        ) : (
          recordOwner && (
            <Button
              variant="contained"
              sx={{ my: 5 }}
              onClick={recordData.id ? updateRecord : addRecord}
            >
              Save
            </Button>
          )
        )}
      </Box>

      <Divider />
      {/* Linked Record Details */}
      {fetchedRecords.length > 0 && treatmentIds.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom mt={1}>
            Linked Records
          </Typography>

          {fetchedRecords.map((list, index) => (
            <Box key={list.id} sx={{ width: "100%" }}>
              {treatmentIds.includes(list.id) && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid black",
                    p: 1,
                  }}
                >
                  <Typography variant="subtitle1">{`${list.title}`}</Typography>
                  <IconButton
                    color="primary"
                    onClick={() => openInNewTab(list.file)}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </>
      )}
      {/* Linked Record Details */}
    </Container>
  );
}

export default MedicalRecordDetail;
