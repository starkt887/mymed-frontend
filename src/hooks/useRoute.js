import { lazy } from "react";
import { useSelector } from "react-redux";

// Routes
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import PrivacyPolicy from "../pages/Other/PrivacyPolicy";
import Terms_Conditions from "../pages/Other/Terms_Conditions";
const DoctorDashboard = lazy(() =>
  import("../pages/Dashboard/DoctorDashboard")
);
const PatientDashboard = lazy(() =>
  import("../pages/Dashboard/PatientDashboard")
);
const Appointments = lazy(() => import("../pages/Appointment/Appointments"));
const DoctorAppointmentDetail = lazy(() =>
  import("../pages/Appointment/DoctorAppointmentDetail")
);
const PatientAppointmentDetail = lazy(() =>
  import("../pages/Appointment/PatientAppointmentDetail")
);
const BookAppointment = lazy(() =>
  import("../pages/Appointment/BookAppointment")
);
const MyUser = lazy(() => import("../pages/My User/MyUser"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const PatientDetail = lazy(() => import("../pages/My User/PatientDetail"));
const DoctorDetail = lazy(() => import("../pages/My User/DoctorDetail"));
const PatientMedicalRecord = lazy(() =>
  import("../pages/Medical Record/PatientMedicalRecord")
);
const MedicalRecordDetail = lazy(() =>
  import("../pages/Medical Record/MedicalRecordDetail")
);
const DoctorMedicalRecord = lazy(() =>
  import("../pages/Medical Record/DoctorMedicalRecord")
);
const AddMedicalRecord = lazy(() =>
  import("../pages/Medical Record/AddMedicalRecord")
);
const Prescription = lazy(() => import("../pages/Presciption/Prescription"));
const GeneratePrescription = lazy(() =>
  import("../pages/Presciption/GeneratePrescription")
);
const VideoChat = lazy(() => import("../pages/Video Chat/VideoChat"));
const PreviewPrescription = lazy(() =>
  import("../pages/Presciption/PreviewPrescription")
);
const Notifications = lazy(() =>
  import("../pages/Notifications/Notifications")
);
import ViewDocument from "../pages/ViewDocument/ViewDocument";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import LogoutIcon from "@mui/icons-material/Logout";
import DvrIcon from "@mui/icons-material/Dvr";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const useRoute = () => {
  const { user } = useSelector((state) => state.user);

  const doctorRoutes = [
    {
      name: "Home",
      Component: Home,
      path: "/",
      auth: false,
      exclude: true,
    },
    {
      name: "Auth",
      Component: Login,
      path: "/auth",
      auth: false,
      exclude: true,
    },
    {
      name: "Auth v2",
      Component: Login,
      path: "/auth/:usertype",
      auth: false,
      exclude: true,
    },
    {
      name: "Email Verification",
      Component: Login,
      path: "/auth/:usertype/:verification_code",
      auth: false,
      exclude: true,
    },
    {
      name: "View Document",
      Component: ViewDocument,
      path: "/viewdoc/:edocid/:eexpdatetime",
      auth: false,
      exclude: true,
    },
    {
      name: "Privacy Policy",
      Component: PrivacyPolicy,
      path: "/privacy-policy",
      auth: false,
      exclude: true,
    },
    {
      name: "Terms & Conditions",
      Component: Terms_Conditions,
      path: "/terms-conditions",
      auth: false,
      exclude: true,
    },
    {
      name: "Dashboard",
      Component: DoctorDashboard,
      path: "/dashboard",
      Icon: DashboardIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Appointments",
      Component: Appointments,
      path: "/appointments",
      Icon: PendingActionsIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Appointment Detail",
      Component: DoctorAppointmentDetail,
      path: "/appointment/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "Prescription",
      Component: Prescription,
      path: "/prescription",
      Icon: ReceiptLongIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Generate Prescription",
      Component: GeneratePrescription,
      path: "/prescription/generate/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "Preview Prescription",
      Component: PreviewPrescription,
      path: "/prescription/preview",
      auth: true,
      exclude: true,
    },
    {
      name: "My Patients",
      Component: MyUser,
      path: "/patients",
      Icon: PeopleIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Patient Detail",
      Component: PatientDetail,
      path: "/patient/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "Video Chat",
      Component: VideoChat,
      path: "/meet",
      auth: true,
      exclude: true,
    },
    {
      name: "Medical Record",
      Component: DoctorMedicalRecord,
      path: "/record",
      Icon: DvrIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Notifications",
      Component: Notifications,
      path: "/notification",
      auth: true,
      Icon: NotificationsActiveIcon,
      exclude: false,
    },
    {
      name: "Add Medical Record",
      Component: AddMedicalRecord,
      path: "/record/new",
      auth: true,
      exclude: true,
    },
    {
      name: "View Medical Record",
      Component: AddMedicalRecord,
      path: "/record/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "Profile",
      Component: Profile,
      path: "/profile",
      Icon: BadgeIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Logout",
      Component: Home,
      path: "/",
      Icon: LogoutIcon,
      auth: true,
      exclude: false,
    },
  ];

  const userRoutes = [
    {
      name: "Home",
      Component: Home,
      path: "/",
      auth: false,
      exclude: true,
    },
    {
      name: "Auth",
      Component: Login,
      path: "/auth",
      auth: false,
      exclude: true,
    },
    {
      name: "Auth v2",
      Component: Login,
      path: "/auth/:usertype",
      auth: false,
      exclude: true,
    },
    {
      name: "Email Verification",
      Component: Login,
      path: "/auth/:usertype/:verification_code",
      auth: false,
      exclude: true,
    },
    {
      name: "View Document",
      Component: ViewDocument,
      path: "/viewdoc/:edocid/:eexpdatetime",
      auth: false,
      exclude: true,
    },
    {
      name: "Privacy Policy",
      Component: PrivacyPolicy,
      path: "/privacy-policy",
      auth: false,
      exclude: true,
    },
    {
      name: "Terms & Conditions",
      Component: Terms_Conditions,
      path: "/terms-conditions",
      auth: false,
      exclude: true,
    },
    {
      name: "Dashboard",
      Component: PatientDashboard,
      path: "/dashboard",
      Icon: DashboardIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Book Appointment",
      Component: BookAppointment,
      path: "/book-appointment",
      Icon: EventNoteIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "My Appointments",
      Component: Appointments,
      path: "/appointments",
      Icon: PendingActionsIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Appointment Detail",
      Component: PatientAppointmentDetail,
      path: "/appointment/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "My Doctors",
      Component: MyUser,
      path: "/doctors",
      Icon: PeopleIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Doctor Detail",
      Component: DoctorDetail,
      path: "/doctor/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "Prescription",
      Component: Prescription,
      path: "/prescription",
      Icon: ReceiptLongIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Preview Prescription",
      Component: PreviewPrescription,
      path: "/prescription/preview",
      auth: true,
      exclude: true,
    },
    {
      name: "Medical Record",
      Component: PatientMedicalRecord,
      path: "/record",
      Icon: DvrIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Notifications",
      Component: Notifications,
      path: "/notification",
      auth: true,
      Icon: NotificationsActiveIcon,
      exclude: false,
    },
    {
      name: "Add Medical Record",
      Component: MedicalRecordDetail,
      path: "/new-record",
      auth: true,
      exclude: true,
    },
    {
      name: "View Medical Record",
      Component: MedicalRecordDetail,
      path: "/record/:id",
      auth: true,
      exclude: true,
    },
    {
      name: "Video Chat",
      Component: VideoChat,
      path: "/meet",
      auth: true,
      exclude: true,
    },
    {
      name: "Profile",
      Component: Profile,
      path: "/profile",
      Icon: BadgeIcon,
      auth: true,
      exclude: false,
    },
    {
      name: "Logout",
      Component: Home,
      path: "/",
      Icon: LogoutIcon,
      auth: true,
      exclude: false,
    },
  ];

  const routes = user.role === "DOCTOR" ? doctorRoutes : userRoutes;
  return routes;
};

export default useRoute;
