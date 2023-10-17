import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import AC from "agora-chat";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import TextField from "@mui/material/TextField";

const conn = new AC.connection({
  appKey: import.meta.env.VITE_AGORA_CHAT_KEY,
});

const AgoraChat = ({ chatToken, appointmentData, userRole }) => {
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  conn.addEventHandler("connection&message", {
    onConnected: () => {
      console.log("Connect success !");
    },
    onDisconnected: () => {
      console.log("Logout success !");
    },
    // Occurs when a text message is received.
    onTextMessage: (message) => {
      console.log(message);
      console.log("Message from: " + message.from + " Message: " + message.msg);
      setMessages([
        ...messages,
        {
          state: "external",
          message: message.msg,
        },
      ]);
      scrollToBottom();
    },
    onError: (error) => {
      console.log("on error", error);
    },
  });

  useEffect(() => {
    conn.open({
      user:
        userRole === "USER" ? appointmentData.userId : appointmentData.doctorId,
      agoraToken: chatToken,
    });
    return () => {
      conn.removeEventHandler("connection&message");
    };
  }, []);

  const handleChange = (e) => setMessage(e.target.value);

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  const chatWindow = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      let option = {
        chatType: "singleChat",
        type: "txt",
        to:
          userRole === "USER"
            ? appointmentData.doctorId
            : appointmentData.userId,
        msg: message,
      };
      let msg = AC.message.create(option);
      conn
        .send(msg)
        .then((res) => {
          setMessages([
            ...messages,
            {
              state: "internal",
              message,
            },
          ]);
          setMessage("");
          scrollToBottom();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box>
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition sx={{ zIndex: 999 }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={3} sx={{ width: 300, height: 400 }}>
              <Typography
                color="white"
                sx={{ backgroundColor: "#2754BB", p: 1.5 }}
              >
                Chat Window
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 290,
                  maxHeight: 290,
                  p: 1,
                  mt: 1,
                  overflowY: "scroll",
                }}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 0.5,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent:
                        msg.state === "internal" ? "flex-start" : "flex-end",
                    }}
                  >
                    <p
                      style={{
                        backgroundColor:
                          msg.state === "internal" ? "#e4e4e4" : "#dfeffc",
                        borderRadius: "5px",
                        maxWidth: "70%",
                        padding: "2px 5px",
                        margin: 0,
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.message}
                    </p>
                  </Box>
                ))}
                <p ref={messagesEndRef} />
              </Box>

              <Grid container spacing={1} p={1} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    placeholder="Send message ..."
                    name="message"
                    onChange={handleChange}
                    size="small"
                    value={message}
                    margin="none"
                    onKeyDown={_handleKeyDown}
                  />

                </Grid>
                <Grid item xs={2}>
                  <IconButton color="primary" onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>

      <Fab
        size="small"
        color="primary"
        onClick={chatWindow("top-end")}
        sx={{ position: "absolute", bottom: 20, right: 20 }}
      >
        <TextsmsOutlinedIcon />
      </Fab>
    </Box>
  );
};

export default AgoraChat;
