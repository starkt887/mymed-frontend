import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import animatedCheck from "../../assets/animated-check.gif"
import ConfettiExplosion from 'react-confetti-explosion';

function Confirmation({ goBack, reset }) {
    const [isExploding, setIsExploding] = useState(true);
    return (
        <Box mt={3} sx={{ boxShadow: 3, p: 2, borderRadius: "10px" }}>
            <Button variant="text" onClick={goBack} sx={{ my: 2, p: 1 }}>
                <ArrowBackIcon />
            </Button>

            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                {isExploding && <ConfettiExplosion
                    force={0.8}
                    duration={3000}
                    particleCount={250}
                    width={1600} onComplete={() => {
                        setIsExploding(false)
                    }} />}
                <Typography variant="h4" gutterBottom>
                    Congratulations
                </Typography>
                <img src={animatedCheck} width={200} height={200} />
                <Typography variant="h6" gutterBottom>
                    Your are successfully registered for
                </Typography>
                <Typography variant="h5" gutterBottom>
                    MEDICAL HEALTH CAMP
                </Typography>
                <Button variant="contained" onClick={() => {
                    setIsExploding(true)
                }} size='large' sx={{ mt: 3, }}>
                    Send Token
                </Button>
                <Button variant="outlined" size='small' onClick={reset} sx={{ mt: 3, mb: 2 }}>
                    Add New
                </Button>
            </Box>

        </Box>
    )
}

export default Confirmation