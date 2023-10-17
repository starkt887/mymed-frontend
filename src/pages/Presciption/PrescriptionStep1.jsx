import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const PrescriptionStep1 = ({ propsData: { user }, goNext }) => {
  return (
    <>
      <Box border={1} borderRadius={10} p={2}>
        <Typography variant="h6" gutterBottom>
          Patient Details
        </Typography>
        <Stack spacing={0}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Mobile: {user.mobile}</p>
          <p>DOB: {user.dob || "N/A"}</p>
          <p>Blood Group: {user.blood_group || "N/A"}</p>
          <p>State: {user.state || "N/A"}</p>
        </Stack>
      </Box>

      <Button variant="contained" onClick={goNext} sx={{ my: 5 }}>
        Next
      </Button>
    </>
  );
};

export default PrescriptionStep1;
