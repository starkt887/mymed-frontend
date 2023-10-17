import { useEffect, useState } from "react";
import { Box, Autocomplete } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Grid from "@mui/material/Grid";
import InputField from "../../components/InputField/InputField";
import ButtonGroup from "@mui/material/ButtonGroup";
import { fetchMedicalInfoAPI } from "../../services/prescriptionService";
import toast from "react-hot-toast";

const PrescriptionStep2 = ({
  propsData: { prescription },
  goBack,
  step2CallBack,
}) => {
  const [symptoms, setSymptoms] = useState([]);
  const [addSymptom, setAddSymptom] = useState("");
  const [diagnosis, setDiagnosis] = useState([]);
  const [addDiagnosis, setAddDiagnosis] = useState("");
  const [symptomSuggestion, setSymptomSuggestion] = useState([]);
  const [diagnosisSuggestion, setDiagnosisSuggestion] = useState([]);

  // Manipulations
  const [symptomsData, setSymptomsData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [selectedChip, setSelectedChip] = useState({
    index: 0,
    name: null,
    type: null,
  });
  const [errors, setErrors] = useState({
    symptomError: false,
    diagnosisError: false,
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
      const { symptoms, diagnosis } = res.data.info;
      setSymptomSuggestion(symptoms);
      setDiagnosisSuggestion(diagnosis);
    }
  };

  const manipulation = () => {
    const arr1 = [];
    const arr2 = [];
    setSymptomsData(prescription.symptoms);
    setDiagnosisData(prescription.diagnosis);
    for (let x in prescription.symptoms) {
      arr1.push(prescription.symptoms[x].name);
    }
    for (let y in prescription.diagnosis) {
      arr2.push(prescription.diagnosis[y].name);
    }
    setSymptoms(arr1);
    setDiagnosis(arr2);
  };

  const handleSymptoms = (_, data, reason, details) => {
    if (reason === "clear") {
      if (addSymptom.trim() !== "") {
        setSymptoms([...symptoms, addSymptom]);
        addTypeData(addSymptom, "symptom");
      }
    } else if (reason === "removeOption") {
      setSymptoms(data);
      const arr = symptomsData.filter(
        (x) => x.name !== details.option && x.type === "symptom"
      );
      setSymptomsData(arr);
    } else {
      const value = data.filter((x) => x.trim() !== "");
      setSymptoms(value);
      addTypeData(value[value.length - 1], "symptom");
    }
    setAddSymptom("");
    setSelectedChip({ index: 0, name: null, type: null });
  };

  const handleSymptomsv2 = (e, value, reason) => {
    if (reason === "clear") {
      if (addSymptom.trim() !== "") {
        setSymptoms([...symptoms, addSymptom]);
        addTypeData(addSymptom, "symptom");
      }
    }
  };

  const handleDiagnosis = (_, data, reason, details) => {
    if (reason === "clear") {
      if (addDiagnosis.trim() !== "") {
        setDiagnosis([...diagnosis, addDiagnosis]);
        addTypeData(addDiagnosis, "diagnosis");
      }
    } else if (reason === "removeOption") {
      setDiagnosis(data);
      const arr = diagnosisData.filter(
        (x) => x.name !== details.option && x.type === "diagnosis"
      );
      setDiagnosisData(arr);
    } else {
      const value = data.filter((x) => x.trim() !== "");
      setDiagnosis(value);
      addTypeData(value[value.length - 1], "diagnosis");
    }
    setAddDiagnosis("");
    setSelectedChip({ index: 0, name: null, type: null });
  };

  const handleDiagnosisv2 = (e, value, reason) => {
    if (reason === "clear") {
      if (addDiagnosis.trim() !== "") {
        setDiagnosis([...diagnosis, addDiagnosis]);
        addTypeData(addDiagnosis, "diagnosis");
      }
    }
  };

  const handleSuggestion = (title, type) => {
    if (type === "symptom") {
      if (!symptoms.includes(title)) {
        setSymptoms([...symptoms, title]);
        addTypeData(title, type);
      }
    } else {
      if (!diagnosis.includes(title)) {
        setDiagnosis([...diagnosis, title]);
        addTypeData(title, type);
      }
    }
  };

  const addTypeData = (name, type) => {
    if (type === "symptom") {
      setSymptomsData([
        ...symptomsData,
        {
          name,
          type: "symptom",
          note: "",
          duration: "",
        },
      ]);
    } else {
      setDiagnosisData([
        ...diagnosisData,
        {
          name,
          type: "diagnosis",
          note: "",
          duration: "",
        },
      ]);
    }
  };

  const handleChipSelection = (index, name, type) => {
    setSelectedChip({ index, name, type });
  };

  const handleDurationButtons = (value) => {
    _modifyTypeData({
      target: {
        name: "duration",
        value,
      },
    });
  };

  const _modifyTypeData = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    let arr;
    if (selectedChip.type === "symptom") arr = [...symptomsData];
    else arr = [...diagnosisData];
    arr[selectedChip.index][inputName] = inputValue;
    if (selectedChip.type === "symptom") setSymptomsData(arr);
    else setDiagnosisData(arr);
  };

  const _validate = () => {
    let symptomErr = false;
    let symptomDataErr = false;
    let diagnosisErr = false;
    let diagnosisDataErr = false;
    const err = { ...errors };

    if (symptomsData.length < 1) {
      symptomErr = true;
      err.symptomError = true;
    } else {
      err.symptomError = false;
    }

    if (diagnosisData.length < 1) {
      diagnosisErr = true;
      err.diagnosisError = true;
    } else {
      err.diagnosisError = false;
    }

    /* no need
    for (let i = 0; i < symptomsData.length; i++) {
      if (symptomsData[i].note === "" || symptomsData[i].duration === "") {
        symptomDataErr = true;
        toast.error("Symptons data missing");
        break;
      }
    }

    for (let j = 0; j < diagnosisData.length; j++) {
      if (diagnosisData[j].note === "" || diagnosisData[j].duration === "") {
        diagnosisDataErr = true;
        toast.error("Diagnosis data missing");
        break;
      }
    } */

    setErrors(err);
    if (symptomErr || diagnosisErr || symptomDataErr || diagnosisDataErr)
      return false;
    return true;
  };

  const _updateStep2 = () => {
    if (_validate()) {
      step2CallBack({ symptomsData, diagnosisData });
    }
  };

  return (
    <Box>
      {/* Symptoms */}
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Symptoms
        </Typography>
        <Autocomplete
          multiple
          options={[]}
          value={symptoms}
          onChange={handleSymptoms}
          onInputChange={handleSymptomsv2}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                color="primary"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              // label="Symptoms"
              placeholder="Symptoms"
              onChange={(e) => setAddSymptom(e.target.value)}
              error={errors.symptomError}
              helperText={errors.symptomError ? "Required" : ""}
            />
          )}
          clearIcon={<ControlPointIcon />}
          clearText="Add"
        />
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, my: 2 }}>
          {symptomSuggestion.map((item) => (
            <Chip
              label={item.name}
              variant="outlined"
              color="secondary"
              key={item.name}
              sx={{
                borderRadius: 1,
              }}
              onClick={() => handleSuggestion(item.name, "symptom")}
            />
          ))}
        </Stack>
      </Box>

      {/* Diagnosis */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h6" gutterBottom>
          Diagnosis
        </Typography>
        <Autocomplete
          multiple
          options={[]}
          value={diagnosis}
          onChange={handleDiagnosis}
          onInputChange={handleDiagnosisv2}
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
              placeholder="Diagnosis"
              onChange={(e) => setAddDiagnosis(e.target.value)}
              error={errors.diagnosisError}
              helperText={errors.diagnosisError ? "Required" : ""}
            />
          )}
          clearIcon={<ControlPointIcon />}
          clearText="Add"
        />
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, my: 2 }}>
          {diagnosisSuggestion.map((item) => (
            <Chip
              label={item.name}
              variant="outlined"
              color="secondary"
              key={item.name}
              sx={{
                borderRadius: 1,
              }}
              onClick={() => handleSuggestion(item.name, "diagnosis")}
            />
          ))}
        </Stack>
      </Box>

      <Grid container spacing={2} my={5}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            <b>Symptoms/Diagnosis</b>
          </Typography>
          <Stack direction="column" alignItems="flex-start" spacing={1}>
            {symptoms.map((item, index) => (
              <Chip
                key={item}
                variant={
                  selectedChip.index === index &&
                  selectedChip.type === "symptom"
                    ? "filled"
                    : "outlined"
                }
                label={item}
                color="primary"
                onClick={() => handleChipSelection(index, item, "symptom")}
              />
            ))}
            {diagnosis.map((item, index) => (
              <Chip
                key={item}
                variant={
                  selectedChip.index === index &&
                  selectedChip.type === "diagnosis"
                    ? "filled"
                    : "outlined"
                }
                label={item}
                color="error"
                onClick={() => handleChipSelection(index, item, "diagnosis")}
              />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            <b>Detail</b>
          </Typography>
          {selectedChip.name &&
            selectedChip.type &&
            selectedChip.type === "symptom" && (
              <>
                <InputField
                  name="note"
                  label="Note"
                  value={symptomsData[selectedChip.index].note}
                  onChange={_modifyTypeData}
                />
                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Duration:
                  </Typography>
                  <ButtonGroup variant="outlined" fullWidth>
                    <Button onClick={() => handleDurationButtons("1")}>
                      1D
                    </Button>
                    <Button onClick={() => handleDurationButtons("3")}>
                      3D
                    </Button>
                    <Button onClick={() => handleDurationButtons("5")}>
                      5D
                    </Button>
                    <Button onClick={() => handleDurationButtons("7")}>
                      1W
                    </Button>
                    <Button onClick={() => handleDurationButtons("14")}>
                      2W
                    </Button>
                  </ButtonGroup>
                  <InputField
                    name="duration"
                    placeholder={"Duration in days"}
                    value={symptomsData[selectedChip.index].duration}
                    onChange={_modifyTypeData}
                    type="number"
                    minLength
                  />
                </Box>
              </>
            )}
          {selectedChip.name &&
            selectedChip.type &&
            selectedChip.type === "diagnosis" && (
              <>
                <InputField
                  name="note"
                  label="Note"
                  value={diagnosisData[selectedChip.index].note}
                  onChange={_modifyTypeData}
                />
                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Duration:
                  </Typography>
                  <ButtonGroup variant="outlined" fullWidth>
                    <Button onClick={() => handleDurationButtons("1")}>
                      1D
                    </Button>
                    <Button onClick={() => handleDurationButtons("3")}>
                      3D
                    </Button>
                    <Button onClick={() => handleDurationButtons("5")}>
                      5D
                    </Button>
                    <Button onClick={() => handleDurationButtons("7")}>
                      1W
                    </Button>
                    <Button onClick={() => handleDurationButtons("14")}>
                      2W
                    </Button>
                  </ButtonGroup>
                  <InputField
                    name="duration"
                    placeholder={"Duration in days"}
                    value={diagnosisData[selectedChip.index].duration}
                    onChange={_modifyTypeData}
                    type="number"
                    minLength
                  />
                </Box>
              </>
            )}
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={goBack}>
            Back
          </Button>
          <Button variant="contained" onClick={_updateStep2}>
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrescriptionStep2;
