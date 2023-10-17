import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { Box, Card, CardActions, CardContent } from "@mui/material";
import Masonry from "@mui/lab/Masonry";


export default function DoctorMedicalRecordTable({
  userData,
  tableData,
  deleteRecords,
  dashboardView = false,
}) {
  const navigate = useNavigate();
  const _navigate = async (data) => {
    navigate(`/record/${data.id}`, { state: data });
  };

  return (
    <React.Fragment>
      <Table size="small" sx={{ display: { sm: "table", xs: "none" }, widht: "100%" }}>
        {tableData && tableData.length > 0 ? (
          <>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Record</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={row.patient.profilepic} sx={{ mr: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    {row.patient.name}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {dayjs(row.createdAt).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View" placement="bottom">
                      <IconButton
                        color="primary"
                        onClick={() => _navigate(row)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {row.createdBy === userData.id && !dashboardView && (
                      <Tooltip title="Delete" placement="bottom">
                        <IconButton
                          color="error"
                          onClick={() => deleteRecords(row.id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        ) : (
          <Typography sx={{ p: 2 }}> No medical records</Typography>
        )}
      </Table>

      {/* Mobile View */}
      <Box sx={{ display: { sm: "none", xs: "block" }, widht: "100%" }}>
        <Masonry columns={2} spacing={1}>
          {tableData?.map((row) => (

            <Card key={row.id}>

              <CardContent sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                <Avatar src={row.patient.profilepic} sx={{ mr: 1 }}>
                  <PersonIcon />
                </Avatar>

                <Typography sx={{ mt: 1.5 }} color="text.primary">
                  {row.patient.name}
                </Typography>
                <Typography variant="p" sx={{ mt: 1.5, fontSize: "12px", }} color="text.secondary">
                  {row.title}
                </Typography>
                <Typography sx={{ fontSize: "12px", }} color="text.secondary">
                  {dayjs(row.createdAt).format("MMM D, YYYY")}
                </Typography>



              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "end" }}>
                <Tooltip title="View" placement="bottom">
                  <IconButton
                    color="primary"
                    onClick={() => _navigate(row)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {row.createdBy === userData.id && !dashboardView && (
                  <Tooltip title="Delete" placement="bottom">
                    <IconButton
                      color="error"
                      onClick={() => deleteRecords(row.id)}
                    >
                      <DeleteOutlineIcon />
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
