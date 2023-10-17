import React, { useState, useEffect } from "react";
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useSelector } from "react-redux";
import { profileChecker } from "../../helper/manipulation";
import { patientAnalyticsAPI } from "../../services/dashboardService";
import AppointmentTable from "../../components/Table/AppointmentTable";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Preview from "../../components/Preview/Preview";
import PatientMedicalRecordTable from "../../components/Table/PatientMedicalRecordTable";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { completion } = profileChecker(user);
  const [analytics, setAnalytics] = useState(null);
  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const [res, error] = await patientAnalyticsAPI({ id: user.id });
    if (!error) {
      setAnalytics(res.data);
    }
  };

  return (
    <Container
      sx={{ my: 5 }}
    // maxWidth={false}
    >
      {/* Title */}
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

    
      <Box sx={{ mt: 5 }}>
        <Grid container rowSpacing={1} columnSpacing={{ sm: 2, md: 3 }}>
          <Grid item sm={12} md={6} px={5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                boxShadow: 3,
                p: 5,
                backgroundColor: "#4574DF",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Total Doctors</Typography>
                <Box>{analytics?.totalDoctors || 0}</Box>
              </Box>
              <Box>
                <PeopleIcon sx={{ fontSize: 50 }} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                boxShadow: 3,
                p: 5,
                mt: 3,
                backgroundColor: "#4574DF",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Total Appointment</Typography>
                <Box>{analytics?.totalAppointments || 0}</Box>
              </Box>
              <Box>
                <PendingActionsIcon sx={{ fontSize: 50 }} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                boxShadow: 3,
                p: 5,
                mt: 3,
                backgroundColor: "#4574DF",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Total Reports</Typography>
                <Box>{analytics?.totalRecords || 0}</Box>
              </Box>
              <Box>
                <ReceiptIcon sx={{ fontSize: 50 }} />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            sx={{
              boxShadow: 3,
              overflowY: "auto",
              height: "470px",
              borderRadius: "10px"
            }}
            px={5}
          >
            <Typography variant="h6" sx={{ px: 2, color: "gray", py: 1 }}>
              Notifications
            </Typography>


            <Box >

              <List sx={{  bgcolor: 'background.paper' }}>
                {notifications.map((item) => {
                  return (
                    <>
                      <ListItem key={item.id} alignItems="flex-start">
                        <ListItemAvatar>

                          <Avatar alt={item.message} src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.subject}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item.message}
                              </Typography>
                              {new Date(item.createdAt).toDateString()}
                            </React.Fragment>
                          }
                        />

                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </>
                  );
                })}

              </List>

            </Box>

          </Grid>
        </Grid>
      </Box>
      {/* Table */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ boxShadow: 3,p:1 }}>
              <Typography variant="h6" sx={{ p: 2 }}>
                Latest Appointments
              </Typography>
              {analytics && (
                <AppointmentTable
                  type="doctor"
                  tableData={analytics.latestAppointment}
                  status={false}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ boxShadow: 3,p:1 }}>
              <Typography variant="h6" sx={{ p: 2 }}>
                Lastest Medical Records
              </Typography>
              {analytics && (
                <PatientMedicalRecordTable
                  userData={user}
                  tableData={analytics.latestRecord}
                  deleteRecords={null}
                  openShareDialog={null}
                  onCheckRecord={null}
                  checkedList={[]}
                  dashboardView={true}
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box sx={{ boxShadow: 3, mt: 5 }}>
            {analytics?.latestPrescription &&
              analytics.latestPrescription?.prescription ? (
              <Preview
                prescription={analytics.latestPrescription?.prescription}
                locationData={analytics.latestPrescription}
              />
            ) : (
              <Typography variant="h6" sx={{ p: 2 }}>
                No latest prescription
              </Typography>
            )}
          </Box>
        </Grid>
      </Box>
    </Container>
  );
};

export default PatientDashboard;
