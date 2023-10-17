import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_LOADING } from "../../redux/appReducer";
import { createOrderAPI, verifyOrderAPI } from "../../services/paymentService";
import { createAppointmentAPI } from "../../services/appointmentService";
import { toast } from "react-hot-toast";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { sendNotificationAPI } from "../../services/NotificationService";
import {
  notificationSender,
  notificationSubjects,
  notificationMessages,
  messageModifier,
} from "../../helper/appointment";

function Checkout({ doctor, goBack, appointmentData }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    paynow();
  }, []);

  //Checkout Step
  const [payment_session_id, setpayment_session_id] = useState(undefined);
  //dispatch(SET_LOADING(false));
  //create appointement
  const paynow = async () => {
    const paymentDom = document.getElementById("payment-form");
    const dropConfig = {
      components: ["order-details", "card", "netbanking", "app", "upi"],
      onSuccess: success,
      onFailure: failure,
      style: {
        backgroundColor: "#ffffff",
        color: "#11385b",
        fontFamily: "Lato",
        fontSize: "14px",
        errorColor: "#ff0000",
        theme: "light", //(or dark)
      },
    };
    dispatch(SET_LOADING(true));
    if (!payment_session_id) {
      const payload = {
        patientId: user.id,
        patientName: user.name,
        patientEmail: user.email,
        patientMobile: user.mobile,
        appointmentFees: appointmentData.appointmentFees,
      };
      const [res, error] = await createOrderAPI(payload);
      if (res) {
        toast.success(res.data.message);
        setpayment_session_id(res.data.data.payment_session_id);
        const cashfree = new Cashfree(res.data.data.payment_session_id);
        cashfree.drop(paymentDom, dropConfig);
      } else {
        toast.error("Payment " + error.message);
      }
    } else {
      const cashfree = new Cashfree(payment_session_id);
      cashfree.drop(paymentDom, dropConfig);
    }
    dispatch(SET_LOADING(false));
  };

  const failure = (data) => {
    alert(data.order.errorText);
  };
  const success = async (data) => {
    if (data.order && data.order.status == "PAID") {
      dispatch(SET_LOADING(true));
      setpayment_session_id(undefined);
      const payload = {
        patientId: user.id,
        doctorId: doctor.id,
        orderid: data.order.orderId,
        transactionId: data.transaction.transactionId,
        amount: data.transaction.transactionAmount,
      };
      const [res, error] = await verifyOrderAPI(payload);
      if (res) {
        toast.success(res.data.message);
        createAppointment();
      } else {
        toast.error(error.response.data.message);
      }
      dispatch(SET_LOADING(false));
    } else {
      //order is still active
      alert("Order is ACTIVE");
    }
  };

  const createAppointment = async () => {
    dispatch(SET_LOADING(true));
    const payload = {
      symptoms: appointmentData.symptomsData,
      description: appointmentData.description,
      userId: user.id,
      doctorId: doctor.id,
      batch: appointmentData.selectedTimeSlot.batch,
      timeslot: appointmentData.selectedTimeSlot.timeslot,
      date: appointmentData.appointmentDate,
      status: appointmentData.status,
    };
    const [res, error] = await createAppointmentAPI(payload);
    if (res) {
      toast.success(res.data.message);
      navigate("/appointments");
      // Notification
      await sendNotificationAPI({
        from: notificationSender(user),
        to: doctor.id,
        subject: notificationSubjects.virtualAppointment,
        message: messageModifier(
          notificationMessages.virtualAppointment,
          user.name,
          dayjs(appointmentData.appointmentDate).format("MMM D, YYYY"),
          appointmentData.selectedTimeSlot.timeslot
        ),
      });
    } else {
      toast.error(error.response.data.message);
    }
    dispatch(SET_LOADING(false));
  };
  return (
    <Container sx={{ my: 5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <Button variant="text" onClick={goBack} sx={{ my: 2, p: 1 }}>
          <ArrowBackIcon />
        </Button>
        <Typography sx={{ px: 4 }} variant="h5" gutterBottom>
          Checkout
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{ width: "500px", height: "500px" }}
          id="payment-form"
        ></div>
      </Box>
    </Container>
  );
}

export default Checkout;
