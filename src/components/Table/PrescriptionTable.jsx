import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";
import Masonry from '@mui/lab/Masonry';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function PrescriptionTable({ user, tableData }) {
  const navigate = useNavigate();

  const _navigate = async (data) => {
    navigate(`/prescription/generate/${data.id}`, { state: data });
  };

  const preview = async (data) => {
    navigate(`/prescription/preview`, { state: data });
  };

  return (
    <React.Fragment>
      <Table size="small" sx={{ display: { sm: "table", xs: "none" }, widht: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell>
              {user.role === "DOCTOR" ? "Patient Name" : "Doctor Name"}
            </TableCell>
            <TableCell>Time Slot</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={
                    row[user.role === "DOCTOR" ? "user" : "doctor"].profilepic
                  }
                  sx={{ mr: 1 }}
                >
                  <PersonIcon />
                </Avatar>
                {row[user.role === "DOCTOR" ? "user" : "doctor"].name}
              </TableCell>
              <TableCell>
                {dayjs()
                  .hour(row.timeslot.split(":")[0])
                  .minute(row.timeslot.split(":")[1] || 0)
                  .format("hh:mm")}{" "}
                {row.batch === "morning" ? "AM" : "PM"}
              </TableCell>
              <TableCell>{dayjs(row.date).format("MMM D, YYYY")}</TableCell>
              <TableCell align="right">
                {user.role === "DOCTOR" && (
                  <>
                    {row.prescription ? (
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => _navigate(row)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Add">
                        <IconButton
                          color="primary"
                          onClick={() => _navigate(row)}
                        >
                          <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
                {row?.prescription?.isCompleted && (
                  <Tooltip title="Preview">
                    <IconButton color="primary" onClick={() => preview(row)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Mobile View */}
      <Box sx={{ display: { sm: "none", xs: "block" }, widht: "100%" }}>
        <Masonry columns={2} spacing={1}>
          {tableData?.map((row) => (

            <Card key={row.id}>

              <CardContent>

                <Avatar
                  src={
                    row[user.role === "DOCTOR" ? "user" : "doctor"].profilepic
                  }
                  sx={{ mr: 1 }}
                >
                  <PersonIcon />
                </Avatar>

                <Typography sx={{ mt: 1.5 }} color="text.primary">
                  {row[user.role === "DOCTOR" ? "user" : "doctor"].name}
                </Typography>
                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                  Completed On
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
                {row?.prescription?.isCompleted && (
                  <Tooltip title="Preview">
                    <IconButton color="primary" onClick={() => preview(row)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}

              </CardActions>
            </Card>

          ))}
        </Masonry>
      </Box>
    </React.Fragment>
  );
}
