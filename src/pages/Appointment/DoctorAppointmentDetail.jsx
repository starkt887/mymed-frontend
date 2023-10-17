import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import {
  checkAppointmentAPI,
  rescheduleAppointmentAPI,
  fetchAppointmentByIdAPI,
} from "../../services/appointmentService";
import { SET_LOADING } from "../../redux/appReducer";
import { UPDATE_MEET } from "../../redux/meetReducer";
import toast from "react-hot-toast";
import { generatePubTokenAPI } from "../../services/videoChatService";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Rating from "@mui/material/Rating";
import { sendNotificationAPI } from "../../services/NotificationService";
import {
  notificationSender,
  notificationSubjects,
  notificationMessages,
  messageModifier,
} from "../../helper/appointment";

const statusColorEnumv2 = {
  Live: "error",
  Completed: "success",
  Virtual: "primary",
  Physical: "warning",
};

const DoctorAppointmentDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { id } = useParams();
  const { user } = useSelector((state) => state.user);

  const [appointmentData, setAppointmentData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [holidayList, setHolidayList] = useState([]);
  const [batchDisability, setBatchDisability] = useState([]);
  const [batchSlots, setBatchSlots] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
  const [conflictDates, setConflictDates] = useState([]);
  const [disableSlots, setDisableSlots] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    setHolidayList(user?.schedule?.holidayList);
    setBatchDisability(user?.schedule?.batchDisability);
    setBatches();
    if (location && location.state) {
      const locationState = location.state;
      setAppointmentData(locationState);
      _elapsedTiming(locationState);
      if (locationState.review) {
        setRating(locationState.review.rating);
        setComments(locationState.review.comment);
      }
    } else {
      dispatch(SET_LOADING(true));
      const [res, error] = await fetchAppointmentByIdAPI({
        appointmentId: id,
        type: "user",
      });
      if (!error) {
        const paramData = res.data.appointment;
        setAppointmentData(paramData);
        _elapsedTiming(paramData);
        if (paramData.review) {
          setRating(paramData.review.rating);
          setComments(paramData.review.comment);
        }
      } else {
        navigate("/appointments");
      }
      dispatch(SET_LOADING(false));
    }
  };

  const _elapsedTiming = (state) => {
    const prevTime = dayjs(
      state.date.substring(0, 11) + state.timeslot + ":00+05:30"
    );
    const currentTime = dayjs();
    const diff = prevTime.diff(currentTime, "minute");
    setElapsedTime(diff);
  };

  const _elapsedSlotTime = (slot) => {
    const diff = dayjs().diff(
      appointmentDate.substring(0, 11) + slot + ":00+05:30",
      "minute"
    );
    return diff >= -30;
  };

  const setBatches = () => {
    let result = {};
    let timeslots = [];
    const batchslot = user?.schedule?.batchslot;
    for (let batch in batchslot) {
      const from = dayjs(batchslot[batch].from).get("hour");
      const to = dayjs(batchslot[batch].to).get("hour");
      for (let i = from; i < to; i++) {
        for (let j = 0; j < 3; j++) {
          const hour = i > 9 ? i : "0" + i;
          const slot =
            j === 0 ? `${hour}:00` : j === 1 ? `${hour}:20` : `${hour}:40`;
          timeslots.push(slot);
        }
      }
      result = { ...result, [batch]: timeslots };
      timeslots = [];
    }
    setBatchSlots(result);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAppointmentDate(null);
    setSelectedTimeSlot({});
    setConflictDates([]);
    setDisableSlots(false);
  };

  const isDoctorHoliday = (date) => {
    const day = date.day();
    return day === 0 || day === 6 || holidayList.includes(dayjs(date).format());
  };

  const handleDateChange = (date) => {
    setDisableSlots(true);
    const selectedDate = dayjs(date).format();
    setAppointmentDate(selectedDate);
    setSelectedTimeSlot({});
    setConflictDates([]);
    checkAppointment(selectedDate);
  };

  const checkAppointment = async (date) => {
    dispatch(SET_LOADING(true));
    const payload = {
      doctorId: user.id,
      date: date.substring(0, 10),
    };
    const [res, error] = await checkAppointmentAPI(payload);
    if (res) {
      setConflictDates(res.data.appointments);
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
    setDisableSlots(false);
  };

  const handleChipChange = (batch, timeslot) => {
    setSelectedTimeSlot({
      batch,
      timeslot,
    });
  };

  const rescheduleAppointment = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      appointmentId: appointmentData.id,
      date: appointmentDate,
      batch: selectedTimeSlot.batch,
      timeslot: selectedTimeSlot?.timeslot,
    };
    handleCloseDialog();
    const [res, error] = await rescheduleAppointmentAPI(payload);
    if (res) {
      toast.success(res.data.message);
      navigate("/appointments");
      // Notification
      await sendNotificationAPI({
        from: notificationSender(user),
        to: appointmentData.userId,
        subject: notificationSubjects.rescheduleAppointment,
        message: messageModifier(
          notificationMessages.rescheduleAppointment,
          dayjs(appointmentData.date).format("MMM D, YYYY"),
          appointmentData.timeslot,
          dayjs(appointmentDate).format("MMM D, YYYY"),
          selectedTimeSlot.timeslot,
          user.name
        ),
      });
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const _connent = async () => {
    dispatch(SET_LOADING(true));
    let myChannelName = null;
    if (appointmentData.channelName) {
      myChannelName = appointmentData.channelName;
    } else {
      const payload = {
        appointmentId: appointmentData.id,
        type: "user",
      };
      const [res, error] = await fetchAppointmentByIdAPI(payload);
      if (!error) {
        setAppointmentData(res.data.appointment);
        myChannelName = res.data.channelName;
      } else {
        myChannelName = null;
      }
    }
    // Notification
    await sendNotificationAPI({
      from: notificationSender(user),
      to: appointmentData.userId,
      subject: notificationSubjects.initiateAppointment,
      message: messageModifier(
        notificationMessages.initiateAppointment,
        user.name,
        dayjs(appointmentData.date).format("MMM D, YYYY"),
        appointmentData.timeslot
      ),
    });
    const [res, error] = await generatePubTokenAPI({
      userId: user.id,
      appointmentId: appointmentData.id,
      myChannelName,
    });
    if (res) {
      dispatch(
        UPDATE_MEET({
          channelName: res.data.channelName,
          video_token: res.data.video_token,
          chat_token: res.data.chat_token,
          uid: res.data.uid,
          appointmentId: appointmentData.id,
          appointmentData: appointmentData,
          userRole: user.role,
        })
      );
      navigate(`/prescription/generate/${appointmentData.id}`);
      // navigate("/meet");
      window.open(window.location.origin + "/meet", "_blank", "noreferrer");
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const goBack = () => {
    navigate("/appointments");
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h5" gutterBottom>
        <IconButton color="inherit" onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>{" "}
        Appointment
      </Typography>

      {appointmentData && (
        <Box sx={{ boxShadow: 3, p: 2, mt: 5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: { xs: 2, md: 5 },
              borderBottom: "1px solid #333",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <Avatar
              src={appointmentData.user?.profilepic}
              sx={{ width: 200, height: 200, mr: 5 }}
            >
              <PersonIcon />
            </Avatar>

            <Box>
              {/* Name */}
              <Typography variant="h5" gutterBottom>
                {appointmentData.user?.name}
                <Chip
                  label={appointmentData.status}
                  color={statusColorEnumv2[appointmentData.status]}
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              </Typography>

              {appointmentData.isRescheduled && (
                <Chip label="RE-SCHEDULED" color="secondary" variant="filled" />
              )}

              {/* Mobile */}
              <Typography variant="button" gutterBottom>
                {appointmentData.user?.mobile}
              </Typography>

              {/* Symptoms */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                {appointmentData.symptoms.map((symptom) => (
                  <Chip label={symptom} key={symptom} sx={{ mr: 1 }} />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 5 }}>
            {/* Description */}
            <Typography variant="subtitle1" gutterBottom>
              <b>Date: </b> {dayjs(appointmentData.date).format("MMM D, YYYY")}
              <br />
              <b>Time: </b>{" "}
              {`${dayjs()
                .hour(appointmentData.timeslot.split(":")[0])
                .minute(appointmentData.timeslot.split(":")[1] || 0)
                .format("hh:mm")} ${
                appointmentData.batch === "morning" ? "AM" : "PM"
              }`}
              <br />
              <b>Description: </b> {appointmentData.description}
              <br />
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ mt: 3 }}>
              {elapsedTime > -30 && appointmentData.status !== "Physical" && (
                <>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{ textTransform: "none", mr: 2 }}
                    onClick={() => setOpenDialog(true)}
                  >
                    Re-schedule
                  </Button>
                  <Button size="medium" variant="contained" onClick={_connent}>
                    Connect
                  </Button>
                </>
              )}
              <Alert variant="standard" severity="warning" sx={{ mt: 1 }}>
                Before connecting, make sure you have reliable net connection
                along with webcam and mic configured
              </Alert>
            </Box>
            {appointmentData.status === "Completed" && (
              <Box>
                {appointmentData.review ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography component="legend">
                        <b>Rating and comments</b>
                      </Typography>
                      <Rating
                        name="read-only"
                        value={rating}
                        sx={{ py: 2, fontSize: 30 }}
                        readOnly
                      />
                    </Box>
                    <Typography variant="body2">
                      {appointmentData.review.comment}
                    </Typography>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            )}
          </Box>

          {/* Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Re-schedule Appointment</DialogTitle>
            <DialogContent>
              {/* Date Picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  views={["day"]}
                  label="Appointment Date"
                  value={appointmentDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ m: 2 }}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  )}
                  shouldDisableDate={isDoctorHoliday}
                  disablePast={true}
                  maxDate={dayjs().add(1, "month").endOf("month")}
                  showToolbar={true}
                  componentsProps={{
                    actionBar: { actions: [] },
                  }}
                />
              </LocalizationProvider>

              {appointmentDate && (
                <>
                  {/* Morning Batch */}
                  {!batchDisability.includes("morning") && (
                    <Box my={2}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Morning Batch
                      </Typography>
                      {batchSlots?.morning?.map((time) => (
                        <Chip
                          clickable
                          variant={
                            selectedTimeSlot.batch === "morning" &&
                            selectedTimeSlot.timeslot === time
                              ? "filled"
                              : "outlined"
                          }
                          label={time}
                          color="primary"
                          key={time}
                          sx={{ mx: 1 }}
                          onClick={() => handleChipChange("morning", time)}
                          disabled={
                            !!conflictDates.find(
                              (x) =>
                                x.batch === "morning" && x.timeslot === time
                            ) ||
                            disableSlots ||
                            _elapsedSlotTime(time)
                          }
                        />
                      ))}
                    </Box>
                  )}

                  {/* Afternoon Batch */}
                  {!batchDisability.includes("afternoon") && (
                    <Box my={2}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Afternoon Batch
                      </Typography>
                      {batchSlots?.afternoon?.map((time) => (
                        <Chip
                          clickable
                          variant={
                            selectedTimeSlot.batch === "afternoon" &&
                            selectedTimeSlot.timeslot === time
                              ? "filled"
                              : "outlined"
                          }
                          label={time}
                          color="primary"
                          key={time}
                          sx={{ mx: 1 }}
                          onClick={() => handleChipChange("afternoon", time)}
                          disabled={
                            !!conflictDates.find(
                              (x) =>
                                x.batch === "afternoon" && x.timeslot === time
                            ) ||
                            disableSlots ||
                            _elapsedSlotTime(time)
                          }
                        />
                      ))}
                    </Box>
                  )}

                  {/* Evening Batch */}
                  {!batchDisability.includes("evening") && (
                    <Box my={2}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Evening Batch
                      </Typography>
                      {batchSlots?.evening?.map((time) => (
                        <Chip
                          clickable
                          variant={
                            selectedTimeSlot.batch === "evening" &&
                            selectedTimeSlot.timeslot === time
                              ? "filled"
                              : "outlined"
                          }
                          label={time}
                          color="primary"
                          key={time}
                          sx={{ mx: 1 }}
                          onClick={() => handleChipChange("evening", time)}
                          disabled={
                            !!conflictDates.find(
                              (x) =>
                                x.batch === "evening" && x.timeslot === time
                            ) ||
                            disableSlots ||
                            _elapsedSlotTime(time)
                          }
                        />
                      ))}
                    </Box>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={rescheduleAppointment}
                variant="contained"
                disabled={
                  !(
                    appointmentDate &&
                    selectedTimeSlot?.batch &&
                    selectedTimeSlot?.timeslot
                  )
                }
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  );
};

export default DoctorAppointmentDetail;
