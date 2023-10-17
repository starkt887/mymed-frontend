import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputField from "../../components/InputField/InputField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { miscellaneousAPI } from "../../services/prescriptionService";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const initialForm = {
  hospital: "",
  position: "",
  startDuration: dayjs().format(),
  endDuration: dayjs().format(),
  responsibility: "",
};

const ProfessionalTab = ({ user, profile, handleChange, updateProfile }) => {
  const [experienceForm, setExperienceForm] = useState(initialForm);
  const [experienceModal, setExperienceModal] = useState(false);
  const [experienceType, setExperienceType] = useState({
    type: "ADD",
    index: null,
  });
  const [specialityDropDown, setSpecialityDropDown] = useState([]);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    const [res, error] = await miscellaneousAPI();
    if (!error) {
      setSpecialityDropDown(res.data.info.specialities);
    }
  };

  const handleFormChange = (e, type) => {
    const data = { ...experienceForm };
    data[e.target.name] =
      type === "number" ? Number(e.target.value) : e.target.value;
    setExperienceForm(data);
  };

  const handleDateChange = (date, name) => {
    const data = { ...experienceForm };
    data[name] = dayjs(date).format();
    setExperienceForm(data);
  };

  const addExperience = () => {
    const e = {
      target: {
        name: "experience",
        value: [...profile.experience, experienceForm],
      },
    };
    handleChange(e, "array");
    setExperienceForm(initialForm);
    setExperienceModal(false);
  };

  const deleteExperience = (index) => {
    const data = [...profile.experience];
    data.splice(index, 1);
    const e = {
      target: {
        name: "experience",
        value: data,
      },
    };
    handleChange(e, "array");
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ boxShadow: 3, p: 2 }}>
          {/* Professional Details */}
          <Typography variant="h6" gutterBottom>
            Professional Details
          </Typography>
          <Typography variant="caption" gutterBottom color="red">
            * All field's are mandatory
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputField
                label="Workplace Name"
                name="clinic_name"
                onChange={handleChange}
                value={profile.clinic_name || ""}
              />
              <InputField
                label="Registration Number"
                name="registration_number"
                onChange={handleChange}
                value={profile.registration_number || ""}
                type="number"
                minLength
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl margin="normal" size="small" fullWidth>
                <InputLabel>Medical Speciality</InputLabel>
                <Select
                  label="Medical Speciality"
                  name="speciality"
                  value={profile.speciality || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {specialityDropDown?.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <DatePicker
                label="Year of Registration"
                name="registration_year"
                openTo="year"
                views={["year"]}
                value={String(profile.registration_year) || ""}
                onChange={(date) =>
                  handleChange({
                    target: {
                      name: "registration_year",
                      value: dayjs(date).year(),
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    size="small"
                    fullWidth
                    error={false}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid direction="row" container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputField
                label="Appointment Fee*"
                name="fees"
                onChange={handleChange}
                value={profile.fees || ""}
                type="number"
                minLength
              />
            </Grid>
          </Grid>
          <InputField
            label="Degree's (Seperated by comma's)"
            name="degree"
            onChange={handleChange}
            value={profile.degree || ""}
            multiline
          />
          <InputField
            label="Work Address"
            name="work_address"
            onChange={handleChange}
            value={profile.work_address || ""}
            multiline
          />
          <InputField
            label="License Number"
            name="license"
            onChange={handleChange}
            value={profile.license || ""}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputField
                label="State Medical Council"
                name="state_medi_council"
                onChange={handleChange}
                value={profile.state_medi_council || ""}
              />
              <InputField
                label="Workplace City"
                name="work_city"
                onChange={handleChange}
                value={profile.work_city || ""}
              />
              <InputField
                label="Workplace Country"
                name="work_country"
                onChange={handleChange}
                value={profile.work_country || ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputField
                label="Experience (Years)"
                name="experience_years"
                onChange={handleChange}
                value={profile.experience_years || ""}
                type="number"
                minLength
              />
              <InputField
                label="Workplace State/Province"
                name="work_state"
                onChange={handleChange}
                value={profile.work_state || ""}
              />
              <InputField
                label="Workplace Zip/Postal code"
                name="work_zip_code"
                onChange={handleChange}
                value={profile.work_zip_code || ""}
              />
            </Grid>
          </Grid>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
            <Button variant="contained" onClick={updateProfile}>
              Update
            </Button>
          </Box>

          {/* Professional Details */}
        </Box>

        {/* Work Experience */}
        <Box sx={{ boxShadow: 3, p: 2, mt: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            <Tooltip title="Add Experience">
              <IconButton
                color="primary"
                size="large"
                onClick={() => setExperienceModal(true)}
                sx={{ border: 1 }}
              >
                <LocationCityIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Experience List */}
          <Box sx={{ m: 1 }}>
            {profile.experience?.map((item, index) => (
              <Box key={index} sx={{ mb: 2, boxShadow: 3, p: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {`${index + 1}. ${item.hospital}`}
                    </Typography>
                    <Typography variant="caption">
                      {dayjs(item.startDuration).format("MMM YYYY")}-
                      {dayjs(item.endDuration).format("MMM YYYY")}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteExperience(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {item.position}
                  </Typography>
                  <Typography variant="subtitle1">
                    {item.responsibility}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
            <Button variant="contained" onClick={updateProfile}>
              Update
            </Button>
          </Box>
        </Box>
        {/* Work Experience */}

        {/* Modal */}
        <Dialog
          open={experienceModal}
          onClose={() => setExperienceModal(false)}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>Add Experience</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InputField
                  label="Hospital/Clinic Name"
                  name="hospital"
                  onChange={handleFormChange}
                  value={experienceForm.hospital || ""}
                />
                <DatePicker
                  label="Start Duration"
                  views={["month", "year"]}
                  format="MM/yyyy"
                  value={experienceForm.startDuration || ""}
                  onChange={(date) => handleDateChange(date, "startDuration")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputField
                  label="Position/Role"
                  name="position"
                  onChange={handleFormChange}
                  value={experienceForm.position || ""}
                />
                <DatePicker
                  label="End Duration"
                  views={["month", "year"]}
                  format="MM/yyyy"
                  value={experienceForm.endDuration || ""}
                  onChange={(date) => handleDateChange(date, "endDuration")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            <InputField
              label="Roles & Responsibilities"
              name="responsibility"
              onChange={handleFormChange}
              value={experienceForm.responsibility || ""}
              multiline
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" variant="outlined" onClick={addExperience}>
              Add
            </Button>
            <Button
              variant="contained"
              onClick={() => setExperienceModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Modal */}
      </LocalizationProvider>
    </>
  );
};

export default ProfessionalTab;
