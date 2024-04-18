import { Alert, Avatar, Box, Button, Container, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import OnBoardingForm from './OnBoardingForm';
import { useDispatch } from 'react-redux';
import { _sanitizeObject } from '../../helper/manipulation';
import { profileUpdateAPI } from '../../services/profileService';
import CheckList from './CheckList';
import Confirmation from './Confirmation';

const steps = ["AADHAR KYC", "Check Up List", "Confimation"];

function CampOnBoard() {

    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);


    //aadhar kyc full name, Aadhaar number, date of birth, gender, country, address, pincode, profile image, and reference IDs
    const [Profile, setProfile] = useState({
        name: "Furkan Malik", mobile: "9857467590",
        gender: "Male",
        dob: "01/01/2002",
        age: "21",
        address: "T-866-67, Faiz Road, Karol Bagh",
        city: "Delhi",
        country: "India",
        state: "Delhi"
    })
    const [document, setDocument] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const inputRef = useRef(null);

    const openImageSelector = () => {
        inputRef.current.click();
    };
    const nextStep = () => {
        setActiveStep(activeStep + 1);
    };

    const goBack = () => {
        setActiveStep(activeStep - 1);
    };

    const _reset = () => {
        setActiveStep(0);
        setProfile({})
    };
    const handleDocument = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            let file = e.target.files[0];
            setDocumentFile(file);

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                setDocument(reader.result);
            };
        }
    };

    const handleChange = (e, type) => {
        const data = { ...profile };
        data[e.target.name] =
            type === "number" ? Number(e.target.value) : e.target.value;
        setProfile(data);

    };

    const startScanner = async () => {
        const result = await BureauAadhaarQRSDK.startScan();
        if (result) {
            alert(result.content); // The QR content will come out here
            // Handle the data as your heart desires here
        } else {
            alert('NO DATA FOUND!');
        }
    }

    //to be done after confirmation
    const handleProfilePic = async (e) => {
        return;
        e.preventDefault();

        if (e.target.files.length > 0) {
            let file = e.target.files[0];
            if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
                toast.error("File type not supported");
                return;
            }

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                setProfilepic(reader.result);
            };

            let payload = new FormData();
            payload.append("id", user.id);
            payload.append("role", user.role);
            payload.append("previousUrl", user.profilepic);
            payload.append("file", file);

            const [res, error] = await addProfilePicAPI(payload);
            if (res) {
                const userData = res.data.profile;
                userData.isLoggedIn = true;
                userData.role = profile.role;
                setProfile(userData);
                dispatch(UPDATE_USER(userData));
                toast.success(res.data.message);
            } else {
                if (error.response) {
                    toast.error(error.response.data.message || error.response.data);
                } else {
                    toast.error("File size limit has been reached");
                }
            }
        }
    };

    const _update = async () => {
        nextStep()
        return;
        dispatch(SET_LOADING(true));
        const payload = _sanitizeObject(profile);
        const [res, error] = await profileUpdateAPI(payload);
        if (res) {
            const userData = res.data.profile;
            userData.isLoggedIn = true;
            userData.role = profile.role;
            setProfile(userData);
            dispatch(UPDATE_USER(userData));
            toast.success(res.data.message);
        } else {
            toast.error(error.response.data.message);
        }
        dispatch(SET_LOADING(false));
    };


    return (
        <Container>
            <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            {activeStep === 0 && <Box mt={3} sx={{ boxShadow: 3, p: 2, borderRadius: "10px" }}>

                <Typography variant="h6" gutterBottom>
                    Personal Details
                </Typography>
                <Stack spacing={1} justifyContent="center" alignItems="center">
                    <Alert severity="info">
                        Image Accepted — Maximum upload size 5mb
                    </Alert>

                    {document && document ? (
                        <>
                            <Avatar
                                alt="Document"
                                src={document}
                                sx={{ width: "100%", height: "350px" }}
                                variant="rounded"
                                onClick={openImageSelector}
                            >
                                <UploadFileIcon />
                            </Avatar>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={openImageSelector}
                            >
                                Change AADHAR
                            </Button>
                        </>

                    ) : (
                        <>

                            <UploadFileIcon
                                sx={{ mt: 3 }}
                                style={{
                                    color: "#FFBF00",
                                    fontSize: "130",
                                    cursor: "pointer",
                                }}
                                onClick={openImageSelector}
                            />
                            <Typography
                                variant="subtitle1"
                                color={fileError ? "error" : ""}
                            >
                                &#x26A0; Upload AADHAR
                            </Typography>
                        </>
                    )}
                    <input
                        accept="image/*,.pdf"
                        type="file"
                        ref={inputRef}
                        hidden={true}
                        onChange={handleDocument}
                    />
                </Stack>
                {/* On document selection and verification of aadhar this section will be opened 
and filled with autofetched data */}
                {document && <OnBoardingForm
                    profile={Profile}
                    handleChange={handleChange}
                    updateProfile={_update}
                    handleProfilePic={handleProfilePic}
                />}

            </Box>}

            {activeStep === 1 && <CheckList
                goBack={goBack}
                nextStep={nextStep} />}

            {activeStep === 2 && <Confirmation
                goBack={goBack}
                nextStep={nextStep}
                reset={_reset} />}

        </Container >
    )
}

export default CampOnBoard