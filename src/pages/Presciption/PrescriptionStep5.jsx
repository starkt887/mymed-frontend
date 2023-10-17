import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Preview from "../../components/Preview/Preview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PrescriptionStep4 = ({
  propsData: { prescription },
  locationData,
  goBack,
  step5CallBack,
}) => {
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
    <Box>
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
        <Preview
          prescription={prescription}
          locationData={locationData}
        ></Preview>
      </Box>

      {/* Buttons */}
      <Box mt={5}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={goBack}>
            Back
          </Button>
          <Button variant="contained" onClick={saveDocument}>
            Download
          </Button>
          <Button variant="contained" onClick={step5CallBack}>
            Complete
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrescriptionStep4;
