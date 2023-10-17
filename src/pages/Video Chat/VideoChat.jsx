import { useState, useEffect } from "react";
import AgoraUIKit from "agora-react-uikit";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "@mui/material/Container";
import { mediaAccessErrorEnums } from "../../helper/videoChat";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useSelector, useDispatch } from "react-redux";
import { disconnectCallAPI } from "../../services/videoChatService";
import { SET_LOADING } from "../../redux/appReducer";
import AgoraChat from "./AgoraChat";

const agoraAppId = import.meta.env.VITE_AGORA_APP_ID;

const VideoChat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const meetRedux = useSelector((state) => state.meet);

  const [videoCall, setVideoCall] = useState(false);
  const [videoToken, setVideoToken] = useState(null);
  const [chatToken, setChatToken] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [uid, setUid] = useState(null);
  const [access, setAccess] = useState(false);
  const [accessError, setAccessError] = useState({});
  const [appointmentId, setAppointmentId] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (
      meetRedux.channelName &&
      meetRedux.video_token &&
      meetRedux.chat_token &&
      meetRedux.uid &&
      meetRedux.appointmentId &&
      meetRedux.appointmentData &&
      meetRedux.userRole
    ) {
      dispatch(SET_LOADING(false));
      setChannelName(meetRedux.channelName);
      setVideoToken(meetRedux.video_token);
      setChatToken(meetRedux.chat_token);
      setUid(meetRedux.uid);
      setAppointmentId(meetRedux.appointmentId);
      setAppointmentData(meetRedux.appointmentData);
      setUserRole(meetRedux.userRole);
      setVideoCall(true);
      _permission();
    } else {
      navigate("/appointments");
    }
  };

  const callbacks = {
    EndCall: async () => {
      setVideoCall(false);
      navigate("/appointments");
      await disconnectCallAPI({ appointmentId });
    },
  };

  // const rtmCallbacks = {
  //   client: {
  //     ConnectionStateChanged: async (newState, reason) => {
  //       if (newState === "DISCONNECTED" && reason === "LOGOUT") {
  //         await disconnectCallAPI({ appointmentId });
  //       }
  //     },
  //   },
  // };

  const _permission = () => {
    const permissions = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    permissions
      .then((stream) => {
        setAccess(true);
      })
      .catch((err) => {
        setAccessError({
          name: err.name,
          message: err.message,
        });
        if (err.name === "NotAllowedError")
          toast.error("Media access permission denied");
        else if (err.name === "NotFoundError")
          toast.error("Media device not found");
        else toast.error("Media device not supported");
      });
  };

  return (
    <Container maxWidth="xl" sx={{ my: 1 }}>
      {videoCall && access && videoToken && channelName && (
        <div style={{ display: "flex", width: "100%", height: "90vh" }}>
          <AgoraUIKit
            rtcProps={{
              appId: agoraAppId,
              channel: channelName,
              token: videoToken,
              uid: uid,
              enableScreensharing: true,
            }}
            styleProps={{
              localBtnContainer: {
                backgroundColor: "#2754BB",
              },
            }}
            callbacks={callbacks}
            // rtmCallbacks={rtmCallbacks}
          />
        </div>
      )}

      {!access && (
        <Stack
          spacing={1}
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "90vh" }}
        >
          <Typography variant="h4">&#x26A0;</Typography>
          <Typography variant="h6" gutterBottom color="GrayText">
            {
              "Please make sure media device (Webcam & Microphone) is properly connected."
            }
          </Typography>
          <Typography variant="h6" gutterBottom color="GrayText">
            {
              "Also ensure to give access permission when prompted at start `OR` "
            }
            <Chip
              label={"Click here"}
              color="primary"
              variant="outlined"
              onClick={_permission}
            />
          </Typography>
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Error Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Chip
                label={accessError?.name}
                color="error"
                variant="outlined"
              />
              {" : "}
              <Typography variant="body2" display="inline">
                {mediaAccessErrorEnums[accessError?.name]}
              </Typography>
              {accessError?.name === "NotAllowedError" && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
                  <img
                    width="100%"
                    style={{ maxWidth: "700px" }}
                    src="https://res.cloudinary.com/dduqbfwtd/image/upload/v1681991745/ezgif.com-optimize_b7fmjk.gif"
                  ></img>
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        </Stack>
      )}

      {/* Chat */}
      {chatToken && userRole && appointmentData && (
        <AgoraChat
          chatToken={chatToken}
          appointmentData={appointmentData}
          userRole={userRole}
        />
      )}
    </Container>
  );
};

export default VideoChat;
