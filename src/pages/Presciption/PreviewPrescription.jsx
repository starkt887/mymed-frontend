import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Preview from "../../components/Preview/Preview";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PreviewPrescription() {
  const location = useLocation();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    if (location && location.state) {
      const locationState = location.state;
      setLocationData(locationState);
      setPrescription(locationState.prescription);
    } else {
      navigate("/prescription");
    }
  }, []);

  const saveDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save("download.pdf");
    });
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h5" gutterBottom>
        Prescription Preview
      </Typography>

      <Box
        border={1}
        borderRadius={5}
        mt={2}
        borderColor={"lightgrey"}
        sx={{
          px: { xs: 0, md: 2 },
          py: 2,
        }}
      >
        {locationData && prescription && (
          <Preview
            prescription={prescription}
            locationData={locationData}
          ></Preview>
        )}
      </Box>

      {/* Buttons */}
      <Box mt={5}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => navigate("/prescription")}>
            Back
          </Button>
          <Button variant="contained" onClick={saveDocument}>
            Download
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default PreviewPrescription;
