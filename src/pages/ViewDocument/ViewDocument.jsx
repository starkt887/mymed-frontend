import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { _isEmpty, _isEmail, _isMobile } from "../../helper/validatiion";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fetchSingleMedicalRecordAPI } from "../../services/MedicalRecordService";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { SET_LOADING } from "../../redux/appReducer";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { Alert } from "@mui/material";

function ViewDocument() {
  const dispatch = useDispatch();
  const [record, setRecord] = useState("");
  const [recordData, setRecordData] = useState({});
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");

  const [isLinkExpired, setisLinkExpired] = useState(true);

  const { edocid, eexpdatetime } = useParams();

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (edocid && eexpdatetime) {
      dispatch(SET_LOADING(true));
      const payload = {
        recordId: edocid,
        expiryDateTime: eexpdatetime,
      };
      const [res, error] = await fetchSingleMedicalRecordAPI(payload);
      if (res) {
        if (res.data.record) {
          toast.success(res.data.message);

          setRecordData(res.data.record);
          setTitle(res.data.record.title);
          setRecord(res.data.record.type);
          setDocument(res.data.record.file);
          const file = res.data.record.file;
          const fileExt = file.substr(file.lastIndexOf(".") + 1);
          if (fileExt === "pdf") setDocumentType("pdf");
          else setDocumentType("image");
          setisLinkExpired(false);
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error(error.response.data.message);
      }
      dispatch(SET_LOADING(false));
    }
  };

  return (
    <Container sx={{ my: 5 }}>
      {!isLinkExpired ? (
        <Alert severity="success">This link is active!</Alert>
      ) : (
        <Alert severity="error">This link is expired!</Alert>
      )}
      <Typography variant="h5" gutterBottom>
        Medical Record{" "}
      </Typography>

      <Grid container spacing={2} columns={16}>
        <Grid item xs={8}>
          <Typography variant="p" gutterBottom>
            {title}
          </Typography>

          <Box sx={{ my: 2 }}></Box>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="p" gutterBottom>
            {record}
          </Typography>
        </Grid>
      </Grid>
      <Box>
        <Stack spacing={1} justifyContent="left" alignItems="left">
          {documentType === "image" ? (
            <Avatar
              alt="Document"
              src={document}
              sx={{ width: "100%", height: "100%" }}
              variant="rounded"
              //onClick={openImageSelector}
            />
          ) : documentType === "pdf" ? (
            <object
              data={document}
              type="application/pdf"
              width="100%"
              height="800"
            ></object>
          ) : (
            <></>
          )}
        </Stack>
      </Box>

      <Divider />
    </Container>
  );
}

export default ViewDocument;
