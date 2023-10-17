import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputField from "../../components/InputField/InputField";
import { fetchMedicalInfoAPI } from "../../services/prescriptionService";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";

import Chip from "@mui/material/Chip";

const PrescriptionStep4 = ({
  propsData: { prescription },
  goBack,
  step4CallBack,
}) => {
  const [test, setTest] = useState("");
  const [tests, setTests] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [followUp, setFollowUp] = useState("0");

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (prescription) {
      setTests(prescription.tests);
      setInstruction(prescription.instructions || "");
      setFollowUp(prescription.followUp);
    }
    const [res, error] = await fetchMedicalInfoAPI();
    if (!error) {
      const { tests } = res.data.info;
      setSuggestion(tests);
    }
  };

  const addTest = () => {
    const find = tests.find((x) => x.name === test);
    if (!find && test.trim() !== "") {
      setTests([...tests, { name: test }]);
      setTest("");
    }
  };

  const removeTest = (name) => {
    let myTests = [...tests];
    myTests = myTests.filter((e) => e.name !== name);
    setTests(myTests);
  };

  const handleSuggestion = (item) => {
    const find = tests.find((x) => x.name === item);
    if (!find) {
      setTests([...tests, { name: item }]);
    }
  };

  const _updateStep4 = () => {
    step4CallBack({ tests, instruction, followUp });
  };

  return (
    <Box>
      <Grid container spacing={2} my={5}>
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>
            Further Tests
          </Typography>
          <InputField
            label="Tests"
            value={test}
            onChange={(e) => setTest(e.target.value)}
          />
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, my: 2 }}>
            {suggestion.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: 1,
                }}
                onClick={() => handleSuggestion(item.name)}
              />
            ))}
          </Stack>
          <Button variant="outlined" onClick={addTest}>
            Add
          </Button>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box
            border={1}
            borderRadius={5}
            px={2}
            pb={1}
            borderColor={"lightgrey"}
          >
            <Typography variant="h6" gutterBottom>
              Tests to be done
            </Typography>
            {tests.map((item) => (
              <Grid container key={item.name}>
                <Grid item xs={11}>
                  <Typography
                    variant="subtitle1"
                    sx={{ wordBreak: "break-word" }}
                  >
                    {item.name}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => removeTest(item.name)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box>
        <InputField
          label="Instructions"
          multiline={true}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </Box>
      <Box px={2} py={2} my={2}>
        <Typography variant="h6" gutterBottom>
          Follow Up
        </Typography>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2, my: 2 }}>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("0")}
          >
            <DoNotDisturbAltOutlinedIcon />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("7")}
          >
            1W
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("14")}
          >
            2W
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("21")}
          >
            3W
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("30")}
          >
            1M
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("60")}
          >
            2M
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            sx={{ border: 1 }}
            onClick={() => setFollowUp("90")}
          >
            3M
          </IconButton>
        </Stack>
        <InputField
          label="Follow Up (days)"
          placeholder="Follow Up (days)"
          type="number"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          minLength
        />
      </Box>

      {/* Buttons */}
      <Box mt={5}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={goBack}>
            Back
          </Button>
          <Button variant="contained" onClick={_updateStep4}>
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrescriptionStep4;
