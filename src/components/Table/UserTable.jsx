import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function UserTable({ user, tableData }) {
  const navigate = useNavigate();

  const _navigate = async (data) => {
    const type = user.role === "DOCTOR" ? "patient" : "doctor";
    navigate(`/${type}/${data.id}`, { state: data });
  };

  return (
    <React.Fragment>
      <Table size="small" sx={{ display: { sm: "table", xs: "none" } }} >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            {/* <TableCell>Mobile</TableCell> */}
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={row.profilepic} sx={{ mr: 1 }}>
                  <PersonIcon />
                </Avatar>
                {row.name}
              </TableCell>
              <TableCell>{row.email}</TableCell>
              {/* <TableCell>{row.mobile}</TableCell> */}
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
        </TableBody>
      </Table>
      {/* Mobile View */}
      <Box sx={{ display: { sm: "none", xs: "block" }, widht: "100%" }}>
        <Masonry columns={2} spacing={1}>
          {tableData?.map((row) => (

            <Card key={row.id}>

              <CardContent sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                <Avatar src={row.profilepic} sx={{ mr: 1 }}>
                  <PersonIcon />
                </Avatar>
                <Typography sx={{ mt: 1.5 }} color="text.primary">
                  {row.name}
                </Typography>
                <Typography variant="p" sx={{ mt: 1.5, fontSize: "12px", }} color="text.secondary">
                  {row.email}
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
    </React.Fragment>
  );
}
