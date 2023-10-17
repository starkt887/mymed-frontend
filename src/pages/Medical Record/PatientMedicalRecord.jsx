import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { SET_LOADING } from "../../redux/appReducer";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import PatientMedicalRecordTable from "../../components/Table/PatientMedicalRecordTable";
import {
  fetchMedicalRecordsAPI,
  findDoctorsAPI,
  deleteRecordAPI,
  shareRecordAPI,
  multiShareRecordAPI,
} from "../../services/MedicalRecordService";
import InputField from "../../components/InputField/InputField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReplyIcon from "@mui/icons-material/Reply";
import PersonIcon from "@mui/icons-material/Person";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { _isEmpty } from "../../helper/validatiion";
import DoneIcon from "@mui/icons-material/Done";
import AlertComponent from "../../components/Alert/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import ShareIcon from "@mui/icons-material/Share";
import { encryptCrypto } from "../../helper/crypto";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
} from "react-share";
import dayjs from "dayjs";
import { sendNotificationAPI } from "../../services/NotificationService";
import {
  notificationSender,
  notificationSubjects,
  notificationMessages,
  messageModifier,
} from "../../helper/appointment";

const PatientMedicalRecord = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [searchRecord, setSearchRecord] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [shareDialog, setShareDialog] = useState(false);
  const [multiShareDialog, setMultiShareDialog] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [sharedRecordData, setSharedRecordData] = useState({});
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [consent, setConsent] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      userId: user.id,
      patientId: user.id,
      role: user.role === "DOCTOR" ? "doctors" : "users",
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

  const handleSearch = (e, type) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setDoctors([]);
    const getData = setTimeout(() => {
      if (searchValue) {
        findDoctors();
      }
    }, 500);

    return () => clearTimeout(getData);
  }, [searchValue]);

  const findDoctors = async () => {
    const [res, error] = await findDoctorsAPI({ searchQuery: searchValue });
    if (!error) setDoctors(res.data.doctors);
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

  const closeShareDialog = () => {
    setShareDialog(false);
    setMultiShareDialog(false);
    setSearchValue("");
    setConsent(false);
  };

  const openShareDialog = (data) => {
    setSharedRecordData(data);
    setShareDialog(true);
  };

  const openMultiShareDialog = () => {
    setMultiShareDialog(true);
  };

  const _filter = (e) => {
    const word = e.target.value;
    setSearchRecord(word);
    let filter = records.filter(
      (data) =>
        data["title"].toLowerCase().search(word.toLowerCase()) !== -1 ||
        data["tags"].includes(word)
    );
    setFilterRecords(filter);
  };

  const getEnc_SharableLink = () => {
    let todaysDate = new Date();
    let tomorrowsDate = new Date();
    tomorrowsDate.setDate(todaysDate.getDate() + 1);
    let encExpDate = encryptCrypto(tomorrowsDate);
    let encRecordId = encryptCrypto(sharedRecordData.id);
    return (
      import.meta.env.VITE_DOMAIN + "/viewdoc/" + encRecordId + "/" + encExpDate
    );
  };

  const _shareRecord = async (doctor_data) => {
    if (!_isEmpty(sharedRecordData.id) && !_isEmpty(doctor_data.id)) {
      dispatch(SET_LOADING(true));
      closeShareDialog();
      const payload = {
        recordId: sharedRecordData.id,
        doctorList: [...sharedRecordData.doctors, doctor_data.id],
      };
      const [res, error] = await shareRecordAPI(payload);
      if (res) {
        toast.success(res.data.message);
        // Notification
        await sendNotificationAPI({
          from: notificationSender(user),
          to: doctor_data.id,
          subject: notificationSubjects.medicalRecordShare,
          message: messageModifier(
            notificationMessages.medicalRecordShare,
            sharedRecordData.title,
            user.name,
            dayjs().format("MMM D, YYYY")
          ),
        });
        _init();
      } else {
        toast.error(error.response.data.message);
      }
      setSharedRecordData({});
      dispatch(SET_LOADING(false));
    } else {
      toast.error("Record missing");
    }
  };

  const handleConsent = (event) => {
    setConsent(event.target.checked);
  };

  const onCheckRecord = (event, id) => {
    if (event.target.checked) {
      setCheckedList([...checkedList, id]);
    } else {
      setCheckedList(checkedList.filter((x) => x !== id));
    }
  };

  const multiShare = async (doctorId) => {
    dispatch(SET_LOADING(true));
    closeShareDialog();
    const [res, error] = await multiShareRecordAPI({
      recordList: checkedList,
      doctorId,
    });
    if (res) {
      toast.success(res.data.message);
      // Notification
      await sendNotificationAPI({
        from: notificationSender(user),
        to: doctorId,
        subject: notificationSubjects.medicalRecordShare,
        message: messageModifier(
          notificationMessages.multiMedicalRecordShare,
          user.name,
          dayjs().format("MMM D, YYYY")
        ),
      });
    } else {
      toast.error(error.response.data.message);
    }
    setCheckedList([]);
    dispatch(SET_LOADING(false));
  };

  return (
    <Container sx={{ my: 5 }}>
      {/* medical records*/}
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
          onClick={() => navigate("/new-record")}
        >
          Add New
        </Button>
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {checkedList.length > 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={openMultiShareDialog}
          >
            <ShareIcon /> Share
          </Button>
        )}
        <InputField
          label="Search"
          name="search"
          onChange={_filter}
          value={searchRecord}
          startIcon={<SearchIcon />}
          styles={{ width: 250 }}
        />
      </Box>

      {/* Table */}
      <Box sx={{ boxShadow: {xs:0,sm:3}, p: 2, mt: 5 }}>
        <PatientMedicalRecordTable
          userData={user}
          tableData={filterRecords}
          deleteRecords={deleteRecord}
          openShareDialog={openShareDialog}
          onCheckRecord={onCheckRecord}
          checkedList={checkedList}
        />
      </Box>

      {/* Dialog */}
      <Dialog
        open={shareDialog}
        onClose={closeShareDialog}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle>Share Link on Social Media</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <Stack direction="row" spacing={2}>
            <EmailShareButton url={getEnc_SharableLink()}>
              <EmailIcon size={32} round={true} />
            </EmailShareButton>
            <LinkedinShareButton url={getEnc_SharableLink()}>
              <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
            <TelegramShareButton url={getEnc_SharableLink()}>
              <TelegramIcon size={32} round={true} />
            </TelegramShareButton>
            <TwitterShareButton url={getEnc_SharableLink()}>
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <FacebookShareButton url={getEnc_SharableLink()}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <WhatsappShareButton url={getEnc_SharableLink()}>
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
          </Stack>
        </DialogContent>
        <DialogTitle>Share Report to Doctor</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <FormControlLabel
            value="end"
            control={<Checkbox onChange={handleConsent} value={consent} />}
            label={
              <Typography sx={{ fontSize: "15px" }}>
                Yes, I would like to share my medical details with the doctor
              </Typography>
            }
            labelPlacement="end"
          />
          <InputField
            label="Search Doctor"
            name="search"
            disabled={!consent}
            onChange={handleSearch}
            value={searchValue}
          />
          <List dense={true}>
            {doctors.slice(0, 5).map((list) => (
              <ListItem
                key={list.id}
                secondaryAction={
                  sharedRecordData?.doctors?.includes(list.id) ? (
                    <DoneIcon color="primary" />
                  ) : (
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => _shareRecord(list)}
                    >
                      <ReplyIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={list.profilepic} alt="Logo">
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={list.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={closeShareDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog */}

      {/* Multi Share Dialog */}
      <Dialog
        open={multiShareDialog}
        onClose={closeShareDialog}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle>Share Report to Doctor</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <FormControlLabel
            value="end"
            control={<Checkbox onChange={handleConsent} value={consent} />}
            label={
              <Typography sx={{ fontSize: "15px" }}>
                Yes, I would like to share my medical details with the doctor
              </Typography>
            }
            labelPlacement="end"
          />
          <InputField
            label="Search Doctor"
            name="search"
            disabled={!consent}
            onChange={handleSearch}
            value={searchValue}
          />
          <List dense={true}>
            {doctors.slice(0, 5).map((list) => (
              <ListItem
                key={list.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => multiShare(list.id)}
                  >
                    <ReplyIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={list.profilepic} alt="Logo">
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={list.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={closeShareDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Multi Share Dialog */}

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

export default PatientMedicalRecord;
