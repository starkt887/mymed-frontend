import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import TextField from "@mui/material/TextField";
import {
  checkAppointmentAPI,
  createAppointmentAPI,
} from "../../services/appointmentService";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOADING } from "../../redux/appReducer";
import Chip from "@mui/material/Chip";
import InputField from "../../components/InputField/InputField";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { sendNotificationAPI } from "../../services/NotificationService";
import {
  notificationSender,
  notificationSubjects,
  notificationMessages,
  messageModifier,
} from "../../helper/appointment";

function PatientBookingDetail({
  doctor,
  goBack,
  nextStep,
  initAappointmentData,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [mode, setMode] = useState("Virtual");
  const [holidayList, setHolidayList] = useState([]);
  const [batchDisability, setBatchDisability] = useState([]);
  const [batchSlots, setBatchSlots] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
  const [conflictDates, setConflictDates] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setHolidayList(doctor?.schedule?.holidayList);
    setBatchDisability(doctor?.schedule?.batchDisability);
    setBatches();
  }, []);

  const setBatches = () => {
    let result = {};
    let timeslots = [];
    const batchslot = doctor?.schedule?.batchslot;
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

  const _elapsedTime = (slot) => {
    const diff = dayjs().diff(
      appointmentDate.substring(0, 11) + slot + ":00+05:30",
      "minute"
    );
    return diff >= -30;
  };

  const isDoctorHoliday = (date) => {
    const day = date.day();
    return day === 0 || day === 6 || holidayList.includes(dayjs(date).format());
  };

  const handleDateChange = (date) => {
    const selectedDate = dayjs(date).format();
    setAppointmentDate(selectedDate);
    setSelectedTimeSlot({});
    setConflictDates([]);
    checkAppointment(selectedDate);
  };

  const checkAppointment = async (date) => {
    dispatch(SET_LOADING(true));
    const payload = {
      doctorId: doctor.id,
      date: date.substring(0, 10),
    };
    const [res, error] = await checkAppointmentAPI(payload);
    if (res) {
      setConflictDates(res.data.appointments);
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const handleChipChange = (batch, timeslot) => {
    setSelectedTimeSlot({
      batch,
      timeslot,
    });
  };

  const _validate = () => {
    if (
      appointmentDate &&
      selectedTimeSlot?.batch &&
      selectedTimeSlot?.timeslot
    )
      return true;
    else {
      toast.error("Please fill the details");
      return false;
    }
  };

  const submit_gonext = () => {
    if (_validate()) {
      let symptomsData = symptoms
        ? symptoms.split(",").map((x) => x.trim())
        : [];
      initAappointmentData({
        symptomsData: symptomsData,
        description: description,
        selectedTimeSlot: selectedTimeSlot,
        appointmentDate: appointmentDate,
        status: mode,
        appointmentFees: doctor.fees,
      });
      if (mode === "Virtual") nextStep();
      else bookAppointment(symptomsData);
    }
  };

  const bookAppointment = async (symptomsData) => {
    dispatch(SET_LOADING(true));
    const payload = {
      symptoms: symptomsData,
      description: description,
      userId: user.id,
      doctorId: doctor.id,
      batch: selectedTimeSlot.batch,
      timeslot: selectedTimeSlot.timeslot,
      date: appointmentDate,
      status: mode,
    };
    const [res, error] = await createAppointmentAPI(payload);
    if (res) {
      toast.success(res.data.message);
      navigate("/appointments");
      // Notification
      await sendNotificationAPI({
        from: notificationSender(user),
        to: doctor.id,
        subject: notificationSubjects.physicalAppointment,
        message: messageModifier(
          notificationMessages.physicalAppointment,
          user.name,
          dayjs(appointmentDate).format("MMM D, YYYY"),
          selectedTimeSlot.timeslot
        ),
      });
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  return (
    <Container sx={{ my: 5 }}>
      {/* Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <Button variant="text" onClick={goBack} sx={{ my: 2, p: 1 }}>
          <ArrowBackIcon />
        </Button>
        <Typography sx={{ px: 4 }} variant="h5" gutterBottom>
          Book Appointment
        </Typography>
      </Box>

      {/* Appointment Date */}
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

      <Alert variant="outlined" severity="info">
        Each appointment slot consists of 20 minutes
      </Alert>

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
                      (x) => x.batch === "morning" && x.timeslot === time
                    ) || _elapsedTime(time)
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
                      (x) => x.batch === "afternoon" && x.timeslot === time
                    ) || _elapsedTime(time)
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
                      (x) => x.batch === "evening" && x.timeslot === time
                    ) || _elapsedTime(time)
                  }
                />
              ))}
            </Box>
          )}
        </>
      )}

      {/* Symptoms */}
      <InputLabel sx={{ pt: 2 }}>
        Any symptoms <Chip label="Optional" size="small" />
      </InputLabel>
      <InputField
        onChange={(e, _) => setSymptoms(e.target.value)}
        value={symptoms}
        margin="none"
      />
      <Typography variant="caption" color={"primary"} sx={{ mb: 2 }}>
        Add multiple symptoms with comma seperator
      </Typography>

      {/* Description */}
      <InputLabel sx={{ pt: 2 }}>
        How are you feeling <Chip label="Optional" size="small" />
      </InputLabel>
      <InputField
        placeholder="Short Description"
        multiline
        onChange={(e, _) => setDescription(e.target.value)}
        value={description}
        margin="none"
      />

      {/* Mode */}
      <Box mt={2}>
        <FormControl>
          <FormLabel>Mode</FormLabel>
          <RadioGroup value={mode} onChange={(e) => setMode(e.target.value)}>
            <FormControlLabel
              value="Virtual"
              control={<Radio />}
              label="Online (Virtual)"
            />
            <FormControlLabel
              value="Physical"
              control={<Radio />}
              label="Offline (Physical visit)"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Actions */}
      <Button variant="contained" onClick={submit_gonext}>
        Submit
      </Button>
    </Container>
  );
}

export default PatientBookingDetail;
