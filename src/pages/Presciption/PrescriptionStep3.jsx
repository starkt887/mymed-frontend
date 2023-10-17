import { useEffect, useState } from "react";
import { Box, Autocomplete } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { fetchMedicalInfoAPI } from "../../services/prescriptionService";
import toast from "react-hot-toast";

const PrescriptionStep3 = ({
  propsData: { prescription },
  goBack,
  step3CallBack,
}) => {
  const [medication, setMedication] = useState(["sad", "abc"]);
  const [addMedication, setAddMedication] = useState("");
  const [medicationData, setMedicationData] = useState([]);
  const [medicationError, setMedicationError] = useState(false);
  const [medicineSuggestion, setMedicineSuggestion] = useState([]);
  const [selectedChip, setSelectedChip] = useState({
    index: 0,
    name: null,
    type: null,
  });

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    if (prescription) {
      manipulation();
    }
    const [res, error] = await fetchMedicalInfoAPI();
    if (!error) {
      const { medication } = res.data.info;
      setMedicineSuggestion(medication);
    }
  };

  const manipulation = () => {
    const arr1 = [];
    setMedicationData(prescription.medication);
    for (let x in prescription.medication) {
      arr1.push(prescription.medication[x].name);
    }
    setMedication(arr1);
  };

  const handleMedications = (_, data, reason, details) => {
    if (reason === "clear") {
      if (addMedication.trim() !== "") {
        setMedication([...medication, addMedication]);
        addTypeData(addMedication, "medication");
      }
    } else if (reason === "removeOption") {
      setMedication(data);
      const arr = medicationData.filter(
        (x) => x.name !== details.option && x.type === "medication"
      );
      setMedicationData(arr);
    } else {
      const value = data.filter((x) => x.trim() !== "");
      setMedication(value);
      addTypeData(value[value.length - 1], "medication");
    }
    setAddMedication("");
    setSelectedChip({ index: 0, name: null, type: null });
  };

  const handleMedicationsv2 = (e, value, reason) => {
    if (reason === "clear") {
      if (addMedication.trim() !== "") {
        setMedication([...medication, addMedication]);
        addTypeData(addMedication, "medication");
      }
    }
  };

  const handleSuggestion = (title, type) => {
    if (!medication.includes(title)) {
      setMedication([...medication, title]);
      addTypeData(title, type);
    }
  };

  const addTypeData = (name, type) => {
    setMedicationData([
      ...medicationData,
      {
        name,
        type,
        quantity: "",
        dosage: "",
        timing: "",
        duration: "",
        specifically: "",
        repeatation: "",
      },
    ]);
  };

  const handleChipSelection = (index, name, type) => {
    setSelectedChip({ index, name, type });
  };

  const _validate = () => {
    let medicationErr = false;
    let medicationDataErr = false;

    if (medicationData.length < 1) {
      medicationErr = true;
      setMedicationError(true);
    } else {
      setMedicationError(false);
    }

    for (let i = 0; i < medicationData.length; i++) {
      if (
        medicationData[i].quantity === "" ||
        medicationData[i].dosage === "" ||
        medicationData[i].timing === "" ||
        medicationData[i].duration === "" ||
        medicationData[i].specifically === ""
      ) {
        medicationDataErr = true;
        toast.error("Medication data missing");
        break;
      }
    }

    if (medicationErr || medicationDataErr) return false;
    return true;
  };

  const handleCustomButtons = (name, value) => {
    _modifyTypeData({
      target: {
        name,
        value,
      },
    });
  };

  const _modifyTypeData = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    let arr = [...medicationData];
    arr[selectedChip.index][inputName] = inputValue;
    setMedicationData(arr);
  };

  const _updateStep3 = () => {
    if (_validate()) {
      step3CallBack(medicationData);
    }
  };

  return (
    <Box>
      {/* Medication */}
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Medication
        </Typography>
        <Autocomplete
          multiple
          options={[]}
          value={medication}
          onChange={handleMedications}
          onInputChange={handleMedicationsv2}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                color="error"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Medication"
              onChange={(e) => setAddMedication(e.target.value)}
              error={medicationError}
              helperText={medicationError ? "Required" : ""}
            />
          )}
          clearIcon={<ControlPointIcon />}
          clearText="Add"
        />
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, my: 2 }}>
          {medicineSuggestion.map((item) => (
            <Chip
              label={item.name}
              variant="outlined"
              color="secondary"
              key={item.name}
              sx={{
                borderRadius: 1,
              }}
              onClick={() => handleSuggestion(item.name, "medication")}
            />
          ))}
        </Stack>
      </Box>

      <Grid container spacing={2} my={5}>
        <Grid item xs={12} md={4}>
          <Box border={1} borderRadius={5} p={2} borderColor={"lightgrey"}>
            <Typography variant="subtitle1" gutterBottom>
              <b>Added Medicines</b>
            </Typography>
            <Stack direction="column" alignItems="flex-start" spacing={1}>
              {medication.map((item, index) => (
                <Chip
                  key={item}
                  variant={
                    selectedChip.index === index &&
                    selectedChip.type === "medication"
                      ? "filled"
                      : "outlined"
                  }
                  label={item}
                  color="error"
                  onClick={() => handleChipSelection(index, item, "medication")}
                />
              ))}
            </Stack>
          </Box>
        </Grid>
        {selectedChip.name && selectedChip.type && (
          <Grid item xs={12} md={8}>
            <Box border={1} borderRadius={5} p={2} borderColor={"lightgrey"}>
              <Typography variant="subtitle1" gutterBottom>
                <b>Medicine Details</b>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("quantity", "5")}
                >
                  5
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("quantity", "10")}
                >
                  10
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("quantity", "15")}
                >
                  15
                </Button>
                <TextField
                  name="quantity"
                  placeholder="Quantity"
                  value={medicationData[selectedChip.index].quantity}
                  onChange={_modifyTypeData}
                  type="number"
                  size="small"
                  minLength
                />
              </Stack>

              <Typography variant="subtitle1" gutterBottom>
                Dosage
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("dosage", "0.5")}
                >
                  1/2
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("dosage", "0.75")}
                >
                  3/4
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("dosage", "1")}
                >
                  1
                </Button>
                <TextField
                  name="dosage"
                  placeholder="Dosage"
                  value={medicationData[selectedChip.index].dosage}
                  onChange={_modifyTypeData}
                  type="number"
                  size="small"
                  minLength
                />
              </Stack>

              <Typography variant="subtitle1" gutterBottom>
                Timing
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("timing", "1")}
                >
                  Once
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("timing", "2")}
                >
                  Twice
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("timing", "3")}
                >
                  Thrice
                </Button>
                <TextField
                  name="timing"
                  placeholder="Time's a day"
                  value={medicationData[selectedChip.index].timing}
                  onChange={_modifyTypeData}
                  type="number"
                  size="small"
                  minLength
                />
              </Stack>

              <Typography variant="subtitle1" gutterBottom>
                Specifically
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <FormControl>
                  <RadioGroup
                    row
                    name="specifically"
                    value={medicationData[selectedChip.index].specifically}
                    onChange={_modifyTypeData}
                  >
                    <FormControlLabel
                      value="Before Food"
                      control={<Radio />}
                      label="Before Food"
                    />
                    <FormControlLabel
                      value="After Food"
                      control={<Radio />}
                      label="After Food"
                    />
                    <FormControlLabel
                      value="Empty Stomach"
                      control={<Radio />}
                      label="Empty Stomach"
                    />
                    <FormControlLabel
                      value="Bedtime"
                      control={<Radio />}
                      label="Bedtime"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>

              <Typography variant="subtitle1" gutterBottom>
                Duration
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("duration", "5")}
                >
                  5
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("duration", "10")}
                >
                  10
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCustomButtons("duration", "20")}
                >
                  20
                </Button>
                <TextField
                  name="duration"
                  placeholder="Duration in days"
                  value={medicationData[selectedChip.index].duration}
                  onChange={_modifyTypeData}
                  type="number"
                  size="small"
                  minLength
                />
              </Stack>

              <Typography variant="subtitle1" gutterBottom>
                Repeatation
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <FormControl>
                  <RadioGroup
                    row
                    name="repeatation"
                    value={medicationData[selectedChip.index].repeatation}
                    onChange={_modifyTypeData}
                  >
                    <FormControlLabel
                      value="Need Renewal"
                      control={<Radio />}
                      label="Need Renewal"
                    />
                    <FormControlLabel
                      value="One Time"
                      control={<Radio />}
                      label="One Time"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Buttons */}
      <Box>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={goBack}>
            Back
          </Button>
          <Button variant="contained" onClick={_updateStep3}>
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrescriptionStep3;
