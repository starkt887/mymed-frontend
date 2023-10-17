import { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { readNotificationAPI } from "../../services/NotificationService";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_NOTIFICATION_COUNT } from "../../redux/notificationReducer";

function Notifications() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const [res, error] = await readNotificationAPI({ id: user.id });
    if (!error) {
      dispatch(UPDATE_NOTIFICATION_COUNT(0));
    }
  };

  return (
    <Container>
      <Typography variant="h5" component="div" gutterBottom sx={{ my: 5 }}>
        Notifications
      </Typography>
      {notifications.map((item) => (
        <Box sx={{ mb: 5 }} key={item.id}>
          <Card
            sx={{
              borderLeft: (theme) =>
                `10px solid ${item.isRead
                  ? theme.palette.grey[500]
                  : theme.palette.info.main
                }`,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography gutterBottom fontWeight="bold">
                {item.subject}
              </Typography>
              <Typography>{item.message}</Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Container>
  );
}

export default Notifications;
