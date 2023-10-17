import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LineChart from "../../components/Line Chart/LineChart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import Alert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { profileChecker } from "../../helper/manipulation";
import { isDoctor } from "../../helper/validatiion";
import { doctorAnalyticsAPI } from "../../services/dashboardService";
import AppointmentTable from "../../components/Table/AppointmentTable";
import DoctorMedicalRecordTable from "../../components/Table/DoctorMedicalRecordTable";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { completion } = profileChecker(user);

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const [res, error] = await doctorAnalyticsAPI({ id: user.id });
    if (!error) {
      setAnalytics(res.data);
    }
  };

  return (
    <Container
      sx={{ my: 5 }}
      // maxWidth={false}
    >
      {/* Alert */}
      {isDoctor(user.role) && !completion && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Complete Profile Details (Personal, Professional, Scheduler) in-order
          to get recognized
        </Alert>
      )}

      {/* Title */}
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      {/* Line chart */}
      <Box sx={{ boxShadow: 3, p: { md: 2 } }}>
        <Typography variant="h6" p={2}>
          Performance Line Chart
        </Typography>
        <LineChart graphData={analytics?.monthWiseData} keyName={"Patients"} />
      </Box>

      {/* Cards */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                boxShadow: 3,
                p: 5,
              }}
            >
              <Box>
                <Typography variant="h6">Total Patients</Typography>
                <Box>{analytics?.totalPatients || 0}</Box>
              </Box>
              <Box>
                <PendingActionsIcon sx={{ fontSize: 50 }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                boxShadow: 3,
                p: 5,
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                boxShadow: 3,
                p: 5,
              }}
            >
              <Box>
                <Typography variant="h6">Total Reports</Typography>
                <Box>{analytics?.totalRecords || 0}</Box>
              </Box>
              <Box>
                <PendingActionsIcon sx={{ fontSize: 50 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <Box sx={{ width: "100%", mt: 5}}>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ boxShadow: 3,p:1 }}>
              <Typography variant="h6" sx={{ p: 2 }}>
                Latest Appointment(s)
              </Typography>
              {analytics && (
                <AppointmentTable
                  type="user"
                  tableData={analytics.latestAppointment}
                  status={false}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ boxShadow: 3,p:1 }}>
              <Typography variant="h6" sx={{ p: 2 }}>
                Latest Report(s)
              </Typography>
              {analytics && (
                <DoctorMedicalRecordTable
                  userData={user}
                  tableData={analytics.latestRecord}
                  deleteRecords={null}
                  dashboardView={true}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DoctorDashboard;
