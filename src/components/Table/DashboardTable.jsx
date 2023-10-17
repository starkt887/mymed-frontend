import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

// Generate Order Data
function createData(id, date, name, shipTo, amount) {
  return { id, date, name, shipTo, amount };
}

const rows = [
  createData(0, "16 Mar, 2019", "Elvis Presley", "Tupelo, MS", 312.44),
  createData(1, "16 Mar, 2019", "Paul McCartney", "London, UK", 866.99),
  createData(2, "16 Mar, 2019", "Tom Scholz", "Boston, MA", 100.81),
  createData(3, "16 Mar, 2019", "Michael Jackson", "Gary, IN", 654.39),
  createData(4, "15 Mar, 2019", "Bruce Springsteen", "Long Branch, NJ", 212.79),
];

export default function Orders() {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src="https://i.pravatar.cc/100" sx={{ mr: 1 }}>
                  <PersonIcon />
                </Avatar>{" "}
                {row.name}
              </TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                >{`$${row.amount}`}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
