import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useSelector, useDispatch } from "react-redux";
import { doctorSchedulerAPI } from "../../services/profileService";
import { SET_LOADING } from "../../redux/appReducer";
import toast from "react-hot-toast";
import { UPDATE_USER } from "../../redux/userReducer";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "selected",
})(({ theme, selected }) => ({
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

const slotTiming = {
  morning: {
    min: 9,
    max: 12,
  },
  afternoon: {
    min: 14,
    max: 17,
  },
  evening: {
    min: 19,
    max: 21,
  },
};

const SchedulerTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState({});

  const [batchslot, setBatchslot] = useState({
    morning: {
      from: dayjs().hour(9).minute(0).format(),
      to: dayjs().hour(12).minute(0).format(),
    },
    afternoon: {
      from: dayjs().hour(14).minute(0).format(),
      to: dayjs().hour(17).minute(0).format(),
    },
    evening: {
      from: dayjs().hour(19).minute(0).format(),
      to: dayjs().hour(21).minute(0).format(),
    },
  });
  const [holidayList, setHolidayList] = useState([]);
  const [batchDisability, setBatchDisability] = useState([]);
  const [batchErrors, setBatchErrors] = useState({});
  const [conflictData, setConflictData] = useState([]);

  useEffect(() => {
    _init();
  }, []);

  const _init = () => {
    setProfile(user);
    if (user?.schedule) {
      if (user?.schedule?.batchslot) setBatchslot(user?.schedule?.batchslot);
      setBatchDisability(user?.schedule?.batchDisability || []);
      setHolidayList(user?.schedule?.holidayList || []);
    }
  };

  const onChangeDate = (date, shift, marker) => {
    // const batches = { ...batchslot };
    const batches = JSON.parse(JSON.stringify(batchslot));
    batches[shift][marker] = dayjs(date).format();
    setBatchslot(batches);
    _validate(batches, shift);
  };

  const _validate = (batches, shift) => {
    const from = dayjs(batches[shift].from).get("hour");
    const to = dayjs(batches[shift].to).get("hour");
    const errors = { ...batchErrors };
    if (from >= to) errors[shift] = "Invalid batch time";
    else errors[shift] = "";
    setBatchErrors(errors);
  };

  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  const findDate = (dates, date) => {
    return dates.find((item) => item === dayjs(date).format());
  };

  const findIndexDate = (dates, date) => {
    return dates.findIndex((item) => item === date);
  };

  const renderPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!holidayList) {
      return <PickersDay {...pickersDayProps} />;
    }
    const selected = findDate(holidayList, date);
    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        selected={selected}
      />
    );
  };

  const disableBatch = (batch) => {
    const batches = [...batchDisability];
    if (batches.includes(batch)) {
      const index = batches.indexOf(batch);
      batches.splice(index, 1);
      setBatchDisability(batches);
    } else {
      batches.push(batch);
      setBatchDisability(batches);
    }
  };

  const updateScheduler = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      id: user.id,
      schedule: {
        batchslot,
        batchDisability,
        holidayList,
        slotTiming,
      },
    };
    const [res, error] = await doctorSchedulerAPI(payload);
    if (res) {
      if (res.data.status === 409) {
        toast.error(res.data.message);
        setConflictData(res.data.conflict);
      } else {
        const userData = res.data.profile;
        userData.isLoggedIn = true;
        userData.role = profile.role;
        setProfile(userData);
        dispatch(UPDATE_USER(userData));
        toast.success(res.data.message);
        setConflictData([]);
      }
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ boxShadow: 3, p: 2 }}>
          {/* Batch Slots */}
          <Typography variant="h6" gutterBottom>
            Appointment Batches
          </Typography>

          <Stack direction="column">
            {conflictData.length > 0 && (
              <Alert severity="error" onClose={() => setConflictData([])}>
                <AlertTitle>Re-schedule Appointment</AlertTitle>
                {conflictData.map((item, index) => (
                  <p key={item.id}>{`${index + 1}. ${item.user.name} - ${
                    item.timeslot
                  } ${item.batch}, ${dayjs(item.date).format(
                    "MMM D, YYYY"
                  )}`}</p>
                ))}
              </Alert>
            )}
            <Box m={2}>
              <Typography sx={{ display: "block", mb: 1 }}>
                Morning Batch
                <Tooltip title="Disable - Morning Batch" placement="top">
                  <IconButton
                    onClick={() => disableBatch("morning")}
                    color={
                      batchDisability.includes("morning") ? "error" : "primary"
                    }
                  >
                    {batchDisability.includes("morning") ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Typography>
              <TimePicker
                label="From"
                views={["hours"]}
                value={batchslot.morning.from}
                onChange={(date) => onChangeDate(date, "morning", "from")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={false}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
                minTime={dayjs()
                  .set("hour", slotTiming.morning.min)
                  .startOf("hour")}
                maxTime={dayjs().set("hour", slotTiming.morning.max)}
                ampm={false}
                ampmInClock={false}
                disabled={batchDisability.includes("morning")}
              />
              <TimePicker
                label="To"
                views={["hours"]}
                value={batchslot.morning.to}
                onChange={(date) => onChangeDate(date, "morning", "to")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={false}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
                minTime={dayjs()
                  .set("hour", slotTiming.morning.min)
                  .startOf("hour")}
                maxTime={dayjs().set("hour", slotTiming.morning.max)}
                ampm={false}
                ampmInClock={false}
                disabled={batchDisability.includes("morning")}
              />
              {batchErrors?.morning && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block" }}
                >
                  &#x26A0; {batchErrors?.morning}
                </Typography>
              )}
            </Box>

            <Box m={2}>
              <Typography sx={{ display: "block", mb: 1 }}>
                Afternoon Batch
                <Tooltip title="Disable - Afternoon Batch" placement="top">
                  <IconButton
                    onClick={() => disableBatch("afternoon")}
                    color={
                      batchDisability.includes("afternoon")
                        ? "error"
                        : "primary"
                    }
                  >
                    {batchDisability.includes("afternoon") ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Typography>
              <TimePicker
                label="From"
                views={["hours"]}
                value={batchslot.afternoon.from}
                onChange={(date) => onChangeDate(date, "afternoon", "from")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={false}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
                minTime={dayjs()
                  .set("hour", slotTiming.afternoon.min)
                  .startOf("hour")}
                maxTime={dayjs().set("hour", slotTiming.afternoon.max)}
                ampm={false}
                ampmInClock={false}
                disabled={batchDisability.includes("afternoon")}
              />
              <TimePicker
                label="To"
                views={["hours"]}
                value={batchslot.afternoon.to}
                onChange={(date) => onChangeDate(date, "afternoon", "to")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={false}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
                minTime={dayjs()
                  .set("hour", slotTiming.afternoon.min)
                  .startOf("hour")}
                maxTime={dayjs().set("hour", slotTiming.afternoon.max)}
                ampm={false}
                ampmInClock={false}
                disabled={batchDisability.includes("afternoon")}
              />
              {batchErrors?.afternoon && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block" }}
                >
                  &#x26A0; {batchErrors?.afternoon}
                </Typography>
              )}
            </Box>

            <Box m={2}>
              <Typography sx={{ display: "block", mb: 1 }}>
                Evening Batch
                <Tooltip title="Disable - Evening Batch" placement="top">
                  <IconButton
                    onClick={() => disableBatch("evening")}
                    color={
                      batchDisability.includes("evening") ? "error" : "primary"
                    }
                  >
                    {batchDisability.includes("evening") ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Typography>
              <TimePicker
                label="From"
                views={["hours"]}
                value={batchslot.evening.from}
                onChange={(date) => onChangeDate(date, "evening", "from")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={false}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
                minTime={dayjs()
                  .set("hour", slotTiming.evening.min)
                  .startOf("hour")}
                maxTime={dayjs().set("hour", slotTiming.evening.max)}
                ampm={false}
                ampmInClock={false}
                disabled={batchDisability.includes("evening")}
              />
              <TimePicker
                label="To"
                views={["hours"]}
                value={batchslot.evening.to}
                onChange={(date) => onChangeDate(date, "evening", "to")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={false}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                )}
                minTime={dayjs()
                  .set("hour", slotTiming.evening.min)
                  .startOf("hour")}
                maxTime={dayjs().set("hour", slotTiming.evening.max)}
                ampm={false}
                ampmInClock={false}
                disabled={batchDisability.includes("evening")}
              />
              {batchErrors?.evening && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block" }}
                >
                  &#x26A0; {batchErrors?.evening}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
              <Button
                variant="contained"
                onClick={updateScheduler}
                disabled={
                  !!(
                    batchErrors?.morning ||
                    batchErrors?.afternoon ||
                    batchErrors?.evening
                  )
                }
              >
                SAVE
              </Button>
            </Box>
          </Stack>
          {/* Batch Slots */}
        </Box>

        {/* Holiday Calender */}
        <Box sx={{ boxShadow: 3, p: 2, mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Holiday Calender
          </Typography>
          <Alert severity="info">Multiple dates can be selected</Alert>

          <StaticDatePicker
            shouldDisableDate={isWeekend}
            views={["day"]}
            disablePast={true}
            maxDate={dayjs().add(1, "month").endOf("month")}
            label="Holiday Calender"
            value={holidayList}
            onChange={(newValue) => {
              const array = [...holidayList];
              const date = dayjs(newValue).format();
              const index = findIndexDate(array, date);
              if (index >= 0) {
                array.splice(index, 1);
              } else {
                array.push(date);
              }
              setHolidayList(array);
            }}
            renderDay={renderPickerDay}
            showToolbar={false}
            componentsProps={{
              actionBar: { actions: [] },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={false}
                sx={{ m: 2 }}
                onKeyDown={(e) => e.preventDefault()}
              />
            )}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ display: "flex", my: 1 }}>
              <CircleIcon color="primary" sx={{ mx: 2 }} />
              <Typography>Selected holidays</Typography>
            </Box>
            <Box sx={{ display: "flex", my: 1 }}>
              <CircleOutlinedIcon sx={{ mx: 2 }} />
              <Typography>Today's date</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
            <Button
              variant="contained"
              onClick={updateScheduler}
              disabled={
                !!(
                  batchErrors?.morning ||
                  batchErrors?.afternoon ||
                  batchErrors?.evening
                )
              }
            >
              SAVE
            </Button>
          </Box>
          {/* Holiday Calender */}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default SchedulerTab;
