import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import PrescriptionStep1 from "./PrescriptionStep1";
import PrescriptionStep2 from "./PrescriptionStep2";
import PrescriptionStep3 from "./PrescriptionStep3";
import PrescriptionStep4 from "./PrescriptionStep4";
import PrescriptionStep5 from "./PrescriptionStep5";
import {
  generatePrescriptionAPI,
  fetchPrescriptionByIdAPI,
} from "../../services/prescriptionService";
import { useDispatch } from "react-redux";
import { SET_LOADING } from "../../redux/appReducer";
import toast from "react-hot-toast";
import { _isEmptyObject } from "../../helper/validatiion";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { sendNotificationAPI } from "../../services/NotificationService";
import {
  notificationSender,
  notificationSubjects,
  notificationMessages,
  messageModifier,
} from "../../helper/appointment";

const steps = [
  "Information",
  "Symptoms/Diagnosis",
  "Medine/Dosage",
  "Instruction",
  "Preview",
];

const GeneratePrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [locationData, setLocationData] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    if (location && location.state) {
      setLocationData(location.state);
      _init(location.state);
    } else if (params.id) {
      _fetch();
    } else {
      navigate("/prescription");
    }
  }, []);

  const _init = (state) => {
    if (state.prescription) {
      setIsNew(false);
      setPrescriptionId(state.prescription.id);
    }
  };

  const _fetch = async () => {
    dispatch(SET_LOADING(true));
    const [res, error] = await fetchPrescriptionByIdAPI({ id: params.id });
    if (res) {
      const data = res.data.appointment;
      if (!_isEmptyObject(data)) {
        setLocationData(data);
        _init(data);
      } else {
        toast.error("No data found");
        navigate("/prescription");
      }
    } else {
      toast.error(error.response.data.message);
      navigate("/prescription");
    }
    dispatch(SET_LOADING(false));
  };

  const goNext = () => {
    setActiveStep(activeStep + 1);
  };

  const goBack = () => {
    setActiveStep(activeStep - 1);
  };

  const step2CallBack = async (data) => {
    const payload = {
      prescriptionId,
      appointmentId: locationData.id,
      symptoms: data.symptomsData,
      diagnosis: data.diagnosisData,
      step: 2,
      isNew,
    };
    dispatch(SET_LOADING(true));
    const [res, error] = await generatePrescriptionAPI(payload);
    if (res) {
      setIsNew(false);
      setPrescriptionId(res.data.prescription.id);
      setLocationData({ ...locationData, prescription: res.data.prescription });
      goNext();
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const step3CallBack = async (data) => {
    const payload = {
      prescriptionId,
      medication: data,
      step: 3,
    };
    dispatch(SET_LOADING(true));
    const [res, error] = await generatePrescriptionAPI(payload);
    if (res) {
      setLocationData({ ...locationData, prescription: res.data.prescription });
      goNext();
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const step4CallBack = async (data) => {
    const payload = {
      prescriptionId,
      tests: data.tests,
      instructions: data.instruction,
      followUp: data.followUp,
      step: 4,
    };
    dispatch(SET_LOADING(true));
    const [res, error] = await generatePrescriptionAPI(payload);
    if (res) {
      setLocationData({ ...locationData, prescription: res.data.prescription });
      goNext();
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  const step5CallBack = async () => {
    await sendNotificationAPI({
      from: notificationSender(locationData.doctor),
      to: locationData.userId,
      subject: notificationSubjects.prescriptionGenerated,
      message: messageModifier(
        notificationMessages.prescriptionGenerated,
        dayjs(locationData.date).format("MMM D, YYYY"),
        locationData.timeslot,
        locationData.doctor.name
      ),
    });
    navigate("/prescription");
  };

  const gotoPrescription = () => {
    navigate("/prescription");
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h5" gutterBottom>
        <IconButton color="inherit" onClick={gotoPrescription}>
          <ArrowBackIcon />
        </IconButton>{" "}
        Generate Prescription
      </Typography>

      <Box sx={{ width: "100%", my: 5 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label} sx={{ display: { xs: "none", sm: "block" } }}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 0 && locationData && (
        <PrescriptionStep1 propsData={locationData} goNext={goNext} />
      )}
      {activeStep === 1 && locationData && (
        <PrescriptionStep2
          propsData={locationData}
          step2CallBack={step2CallBack}
          goBack={goBack}
        />
      )}
      {activeStep === 2 && locationData && (
        <PrescriptionStep3
          propsData={locationData}
          step3CallBack={step3CallBack}
          goBack={goBack}
        />
      )}
      {activeStep === 3 && locationData && (
        <PrescriptionStep4
          propsData={locationData}
          step4CallBack={step4CallBack}
          goBack={goBack}
        />
      )}
      {activeStep === 4 && locationData && (
        <PrescriptionStep5
          propsData={locationData}
          step5CallBack={step5CallBack}
          locationData={locationData}
          goBack={goBack}
        />
      )}
    </Container>
  );
};

export default GeneratePrescription;
