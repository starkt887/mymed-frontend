import { useState, useEffect } from "react";
import { fetchRecordByPatientIdAPI } from "../../services/MedicalRecordService";
import { useSelector, useDispatch } from "react-redux";
import { SET_LOADING } from "../../redux/appReducer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const MedicalHistory = ({ patientData }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [records, setRecords] = useState([]);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      doctorId: user.id,
      patientId: patientData.id,
    };
    const [res, error] = await fetchRecordByPatientIdAPI(payload);
    if (res) {
      setRecords(res.data.records);
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {records.map((item, index) => (
          <ListItem
            key={item.id}
            disableGutters
            secondaryAction={
              <IconButton onClick={() => openInNewTab(item.file)}>
                <OpenInNewIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${index + 1}. ${item.title}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default MedicalHistory;
