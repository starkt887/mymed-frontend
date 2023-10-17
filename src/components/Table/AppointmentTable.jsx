import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, Paper, styled } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import VisibilityIcon from '@mui/icons-material/Visibility';

const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];

export default function AppointmentTable({ type, tableData, status = true }) {
  const navigate = useNavigate();

  const _navigate = async (data) => {
    navigate(`/appointment/${data.id}`, { state: data });
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <React.Fragment>
      {tableData && tableData.length > 0 ? <>
        <Table size="small" sx={{ display: { xs: "none", sm: "table" } }}>
          <TableHead>
            <TableRow>
              <TableCell>
                {type === "doctor" ? "Doctor Name" : "Patient Name"}
              </TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Date</TableCell>
              {status && <TableCell>Status</TableCell>}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={row[type].profilepic} sx={{ mr: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  {row[type].name}
                </TableCell>
                <TableCell>
                  {dayjs()
                    .hour(row.timeslot.split(":")[0])
                    .minute(row.timeslot.split(":")[1] || 0)
                    .format("hh:mm")}{" "}
                  {row.batch === "morning" ? "AM" : "PM"}
                </TableCell>
                <TableCell>
                  {/* {dayjs(row.date).format("MMM D, YYYY h:mm A")} */}
                  {dayjs(row.date).format("MMM D, YYYY")}
                </TableCell>
                {status && <TableCell>{row.status}</TableCell>}
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => _navigate(row)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
        {/* Mobile View */}
        <Box sx={{ display: { sm: "none", xs: "block" }, widht: "100%" }}>
          <Masonry columns={2} spacing={1}>
            {tableData?.map((row) => (

              <Card key={row.id}>

                <CardContent>

                  <Avatar src={row[type].profilepic} sx={{ width: "50px", height: "50px" }}>
                    <PersonIcon />
                  </Avatar>

                  <Typography sx={{ mt: 1.5 }} color="text.primary">
                    {row[type].name}
                  </Typography>
                  <Typography sx={{ mt: 1.5 }} color="text.secondary">
                    Scheduled On
                  </Typography>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                      {dayjs(row.date).format("MMM D, YYYY")}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                      {dayjs()
                        .hour(row.timeslot.split(":")[0])
                        .minute(row.timeslot.split(":")[1] || 0)
                        .format("hh:mm")}{" "}
                      {row.batch === "morning" ? "AM" : "PM"}
                    </Typography>
                  </Box>

                  <Typography sx={{ mt: 1.5 }} color="text.secondary">
                    {row.symptoms && row.symptoms.length > 0 && <>Symptoms</>}
                  </Typography>
                  <Typography variant="body2">
                    {row.symptoms?.map((symps) => {
                      return <>
                        {symps},
                      </>
                    })}


                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "end" }}>
                  <IconButton
                    size="small"
                    variant="contained"
                    onClick={() => _navigate(row)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </CardActions>
              </Card>

            ))}
          </Masonry>
        </Box>
      </> :
        <Typography sx={{ p: 2 }}>No appointments</Typography>}

    </React.Fragment >
  );
}
