import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function MedicineTable({ tableData, locationData }) {
  return (
    <React.Fragment>
      <Table size="small" sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16, px: 5 }}>
              Sr.no
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
              Medicine
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
              Dosage
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
              Timing
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
              Intake Time
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
              Duration (in days)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((row, key) => (
            <TableRow key={row.name}>
              <TableCell sx={{ px: 5 }}>{++key}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.dosage}</TableCell>
              <TableCell>{row.timing}</TableCell>
              <TableCell>{row.specifically || "-"}</TableCell>
              <TableCell>{row.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile View */}
      <Box>
        {tableData?.map((row, key) => (
          <Card key={row.name} sx={{ minWidth: 275, mt: 1, display: { xs: "block", md: "none" } }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Sr.no: {++key}
              </Typography>
              <Typography variant="h5" component="div">
                {row.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#4328be",
                }}
              >
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Quantity: {row.quantity}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Dosage: {row.dosage}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#4328be",
                }}
              >
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Timings: {row.timing}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Duration:{row.duration} Days
                </Typography>
              </Box>



              <Typography variant="body2">
                Intake Time:
                <br />
                "{row.specifically}"
              </Typography>
            </CardContent>

          </Card>
        ))}
      </Box>


    </React.Fragment>
  );
}
