import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Tests = [
    {
        id: 1,
        title: 'OPTHAMLOLOGY CHECK UP',
        description:
            'It shall include screening of visual impairment and identifying diseases which cause blindness like Cataract , Glaucoma , Trachoma , Vitamin A deficiency , Xeropthalmia ,etc . Also visual assessment for colour vision and near and distant vision will bedone.',
    },
    {
        id: 2,
        title: 'DENTAL CHECKUP',
        description:
            'dental hygiene checkup , screening for tooth cavities , oral cancer , tongue ailments , etc',
    },
    {
        id: 3,
        title: 'ORTHOPAEDIC CONSULTATION ',
        description:
            'BONE MASS DENSITY screening for all , knee replacement screening with a portable Xray unit for the needy and quick assessment , calcium and vit d 3 deficiency , physiotherapy etc ',
    },
    {
        id: 4,
        title: 'GENERAL SCREENING',
        description:
            'height , weight , bp , temperature , nutritional assessment , primary diseases screening like diabetes , hypertension , fever illness , skin problems , asthama , alchoholic liver diseases and much more.',
    },

    {
        id: 5,
        title: 'BLOOD TEST – BLOOD SUGARS / BLOOD GROUP',
        description:
            'Conducting Random Blood sugar level test with help of Digital Glucometers for A primary screening of diabetes. Assessment of Individual Blood Group for every citizen – incase of emergency its helpful for the same.',
    },
    {
        id: 6,
        title: 'GYNAECOLOGY – OBSTETRICS SCREENING FOR WOMEN',
        description:
            'Addressing the concern for Pregnant Women and non pregnant female related issues ,Family Planning expert guidance for birth control .',
    },
];

function CheckList({ goBack, nextStep }) {
    const [checked, setChecked] = React.useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        console.log(newChecked);
        setChecked(newChecked);
    };
    return (<Box mt={3} sx={{ boxShadow: 3, p: 2, borderRadius: "10px" }}>
        <Button variant="text" onClick={goBack} sx={{ my: 2, p: 1 }}>
            <ArrowBackIcon />
        </Button>
        <Typography variant="h6" gutterBottom>
            Check Up List
        </Typography>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {Tests.map((test) => {
                const labelId = `checkbox-list-label-${test.title}`;

                return (
                    <ListItem
                        key={test.id}
                        sx={{ boxShadow: 3, borderRadius: '10px', mb: 2 }}
                    >
                        <ListItemButton role={undefined} onClick={handleToggle(test.id)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(test.id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={test.title}
                                secondary={
                                    <React.Fragment>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="p">Learn more...</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="p">{test.description}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </React.Fragment>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>

        <Button variant="contained" onClick={nextStep} sx={{ mt: 3, mb: 2 }}>
            Next
        </Button>
    </Box>
    )
}

export default CheckList