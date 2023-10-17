import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import {
  fetchAppointmentByIdAPI,
  addReviewAPI,
} from "../../services/appointmentService";
import { generateSubTokenAPI } from "../../services/videoChatService";
import { SET_LOADING } from "../../redux/appReducer";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { UPDATE_MEET } from "../../redux/meetReducer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";

const statusColorEnumv2 = {
  Live: "error",
  Completed: "success",
  Virtual: "primary",
  Physical: "warning",
};

const PatientAppointmentDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [appointmentData, setAppointmentData] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (location && location.state) {
      const locationState = location.state;
      setAppointmentData(locationState);
      if (locationState.review) {
        setRating(locationState.review.rating);
        setComments(locationState.review.comment);
      }

      _elapsedTiming(locationState);
    } else {
      // DB CALL
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

  const _connent = async () => {
    dispatch(SET_LOADING(true));
    if (appointmentData.channelName) {
      const [res, error] = await generateSubTokenAPI({
        userId: user.id,
        channelName: appointmentData.channelName,
      });
      if (res) {
        dispatch(
          UPDATE_MEET({
            channelName: appointmentData.channelName,
            video_token: res.data.video_token,
            chat_token: res.data.chat_token,
            uid: res.data.uid,
            appointmentId: appointmentData.id,
            appointmentData: appointmentData,
            userRole: user.role,
          })
        );
        window.open(window.location.origin + "/meet", "_blank", "noreferrer");
      } else {
        toast.error("Something went wrong, please refresh");
      }
    } else {
      toast.error("Appointment not initiated, please try later");
      const payload = {
        appointmentId: appointmentData.id,
        type: "doctor",
      };
      const [res, error] = await fetchAppointmentByIdAPI(payload);
      if (!error) {
        setAppointmentData(res.data.appointment);
      }
    }
    dispatch(SET_LOADING(false));
  };

  const goBack = () => {
    navigate("/appointments");
  };

  const _submitReview = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      appointmentId: appointmentData.id,
      rating: rating,
      comment: comments,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.userId,
    };
    const [res, error] = await addReviewAPI(payload);
    if (res) {
      toast.success("Review submitted successfully");
      navigate("/appointments");
    } else {
      toast.error("Something went wrong, please try again");
    }
    dispatch(SET_LOADING(false));
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
              src={appointmentData.doctor?.profilepic}
              sx={{ width: 200, height: 200, mr: 5 }}
            >
              <PersonIcon />
            </Avatar>

            <Box>
              {/* Name */}
              <Typography variant="h5" gutterBottom>
                {appointmentData.doctor?.name}
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
              {/* <Typography variant="button" gutterBottom>
                {appointmentData.doctor?.mobile}
              </Typography> */}

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
              <b>Description: </b> {appointmentData.description || "-"}
              <br />
            </Typography>
            {/* Action Buttons */}
            <Box sx={{ mt: 3 }}>
              {elapsedTime > -30 && appointmentData.status !== "Physical" && (
                <>
                  <Button size="medium" variant="contained" onClick={_connent}>
                    Connect
                  </Button>
                  <Alert variant="standard" severity="warning" sx={{ mt: 1 }}>
                    Before connecting, make sure you have reliable net
                    connection along with webcam and mic configured
                  </Alert>
                </>
              )}
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
                        sx={{ py: 1, fontSize: 30 }}
                        readOnly
                      />
                    </Box>
                    <Typography variant="body2">
                      {appointmentData.review.comment}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography component="legend">
                      <b>Please rate and share your experiences</b>
                    </Typography>
                    <Box>
                      <Box>
                        <Rating
                          name="simple-controlled"
                          value={rating}
                          sx={{ py: 2, fontSize: 40 }}
                          onChange={(event, newValue) => {
                            setRating(newValue);
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Comments please"
                        fullWidth
                        multiline
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        maxRows={5}
                      />
                    </Box>
                  </>
                )}
                {appointmentData.review ? (
                  <></>
                ) : (
                  <Box>
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={_submitReview}
                      sx={{ mt: 2 }}
                    >
                      Submit review
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PatientAppointmentDetail;
