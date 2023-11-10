import { Avatar, Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import PersonIcon from "@mui/icons-material/Person";
import InputField from '../../components/InputField/InputField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function OnBoardingForm({
    profile,
    handleChange,
    updateProfile,
    handleProfilePic,
}) {
    return (
        <Box mt={5}>
            

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <input
                    accept="image/*"
                    id="upload-avatar-pic"
                    type="file"
                    hidden
                    name="profilepic"
                    onChange={handleProfilePic}
                />
                <label htmlFor="upload-avatar-pic">
                    <IconButton component="span">
                        <Avatar
                            //src={user?.profilepic ? user?.profilepic : profilepic}
                            sx={{ width: 200, height: 200 }}
                        >
                            <PersonIcon />
                        </Avatar>
                    </IconButton>
                </label>

            </Box>

            <InputField
                label="Name"
                name="name"
                onChange={handleChange}
                value={profile.name || ""}
            />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        value={profile.email || ""}
                        disabled
                    />
                    <FormControl margin="normal" size="small" fullWidth>
                        <InputLabel>Blood Group</InputLabel>
                        <Select
                            label="Blood Group"
                            name="blood_group"
                            value={profile.blood_group || ""}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"A+"}>A+</MenuItem>
                            <MenuItem value={"A-"}>A-</MenuItem>
                            <MenuItem value={"B+"}>B+</MenuItem>
                            <MenuItem value={"B-"}>B-</MenuItem>
                            <MenuItem value={"O+"}>O+</MenuItem>
                            <MenuItem value={"O-"}>O-</MenuItem>
                            <MenuItem value={"AB+"}>AB+</MenuItem>
                            <MenuItem value={"AB-"}>AB-</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="Mobile"
                        name="mobile"
                        onChange={handleChange}
                        value={profile.mobile || ""}
                    />
                    <FormControl margin="normal" size="small" fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            label="Gender"
                            name="gender"
                            value={profile.gender || ""}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"male"}>Male</MenuItem>
                            <MenuItem value={"female"}>Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Birth"
                            name="dob"
                            inputFormat="DD/MM/YYYY"
                            value={profile.dob || ""}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="normal"
                                    size="small"
                                    fullWidth
                                    error={false}
                                />
                            )}
                            onChange={(date) =>
                                handleChange({
                                    target: {
                                        name: "dob",
                                        value: dayjs(date).format("MM/DD/YYYY"),
                                    },
                                })
                            }
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="Age"
                        name="age"
                        onChange={handleChange}
                        value={profile.age || ""}
                        type="number"
                        minLength
                    />
                </Grid>
            </Grid>
            <Grid direction="row" container spacing={2}>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="Height (cm's)"
                        name="height"
                        onChange={handleChange}
                        value={profile.height || ""}
                        type="number"
                        minLength
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="Weight (kg's)"
                        name="weight"
                        onChange={handleChange}
                        value={profile.weight || ""}
                        type="number"
                        minLength
                    />
                </Grid>
            </Grid>
            <InputField
                label="Residential Address"
                name="address"
                onChange={handleChange}
                value={profile.address || ""}
                multiline
            />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="City"
                        name="city"
                        onChange={handleChange}
                        value={profile.city || ""}
                    />
                    <InputField
                        label="Country"
                        name="country"
                        onChange={handleChange}
                        value={profile.country || ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <InputField
                        label="State/Province/Region"
                        name="state"
                        onChange={handleChange}
                        value={profile.state || ""}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" onClick={updateProfile} sx={{ mt: 3, mb: 2 }}>
                Submit
            </Button>
        </Box>
    )
}

export default OnBoardingForm