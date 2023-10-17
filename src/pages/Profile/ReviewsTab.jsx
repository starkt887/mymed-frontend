import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import Divider from "@mui/material/Divider";
import { fetchProfileRatingsAPI } from "../../services/profileService";
import { useSelector } from "react-redux";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CircularProgress from "@mui/material/CircularProgress";

const ReviewsTab = () => {
  const { user } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _init(page);
  }, []);

  const _init = async (currentPage) => {
    setLoading(true);
    const [res, error] = await fetchProfileRatingsAPI({
      doctorId: user.id,
      page: currentPage,
    });
    if (!error) {
      const reviews = res.data.reviews;
      if (reviews.length > 0) {
        setReviewData(reviews);
        setPage(currentPage);
      }
    }
    setLoading(false);
  };

  const goPrevious = () => {
    if (page !== 1) {
      _init(page - 1);
    }
  };

  const goNext = () => {
    _init(page + 1);
  };

  return (
    <Box sx={{ boxShadow: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reviews & Ratings
      </Typography>

      {/* Loader */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="primary" size={50} thickness={8} />
        </Box>
      ) : reviewData.length ? (
        reviewData.map((item) => (
          <Box key={item.id}>
            {/* Head Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mx: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Display Picture */}
                <Avatar src={item.user.profilepic} alt="logo" sx={{ mr: 2 }}>
                  <PersonIcon />
                </Avatar>

                {/* Name & Rating */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle2">{item.user.name}</Typography>
                  <Rating value={item.rating} size="small" readOnly />
                </Box>
              </Box>

              {/* Warning Button */}
              <IconButton
                color="warning"
                sx={{
                  bgcolor: "#FFA700",
                  color: "#fff",
                  "&:hover": {
                    color: "#FFA700",
                  },
                }}
              >
                <ReportGmailerrorredOutlinedIcon />
              </IconButton>
            </Box>
            {/* Head Section */}

            {/* Body Section */}
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" gutterBottom>
                {item.comment}
              </Typography>
            </Box>
            {/* Body Section */}

            {/* Footer */}
            <Divider sx={{ mb: 2 }} />
            {/* Footer */}
          </Box>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            No Reviews!
          </Typography>
        </Box>
      )}
      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "20px",
        }}
      >
        <IconButton
          sx={{ backgroundColor: "grey" }}
          size="large"
          onClick={goPrevious}
        >
          <KeyboardArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          sx={{ backgroundColor: "grey" }}
          size="large"
          onClick={goNext}
        >
          <KeyboardArrowRightIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ReviewsTab;
