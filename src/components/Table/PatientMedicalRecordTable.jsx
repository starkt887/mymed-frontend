import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { Box, Card, CardActions, CardContent } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

export default function PatientMedicalRecordTable({
  userData,
  tableData,
  deleteRecords,
  openShareDialog,
  onCheckRecord,
  checkedList,
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
                {!dashboardView && <TableCell>Record</TableCell>}
                <TableCell >Name</TableCell>
                <TableCell >Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData?.map((row, index) => (
                <TableRow key={row.id}>
                  {!dashboardView && (
                    <TableCell>
                      <Box display={"flex"} justifyContent={"start"} alignItems={"center"}>
                      <Checkbox
                        checked={checkedList.includes(row.id)}
                        onChange={(e) => onCheckRecord(e, row.id)}
                      />
                      <Typography sx={{ display: { xs: "none", sm: "block" } }}> {index + 1}</Typography>
                      </Box>
                    </TableCell>
                  )}
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
                    {userData.id === row.createdBy && !dashboardView && (
                      <>
                        <Tooltip title="Share" placement="bottom">
                          <IconButton
                            color="primary"
                            onClick={() => openShareDialog(row)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete" placement="bottom">
                          <IconButton
                            color="error"
                            onClick={() => deleteRecords(row.id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </>
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
              

                <Typography sx={{ mt: 1.5 }} color="text.primary">
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
