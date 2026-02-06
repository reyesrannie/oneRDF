import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const SystemCard = ({ data }) => {
  const systemImage = useSelector((state) => state.modal.systemImage);
  const [copied, setCopied] = useState(false);
  const image = systemImage?.find((img) => img?.id === data?.id)?.url;

  const handleCopy = () => {
    const textToCopy = data?.url_holder || "";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "40% 60%" },
        width: "100%",
        maxWidth: { xs: "100%", sm: "450px" },
        minWidth: { xs: "unset", sm: "450px" },
        minHeight: "200px",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      {/* Top Section (Mobile) / Right Section (Desktop) */}
      <CardContent
        sx={{
          position: "relative",
          background: "linear-gradient(233deg, #FFF 40.37%, #F6931E 128.97%)",
          boxShadow: "4px 4px 3.8px rgba(0, 0, 0, 0.25)",
          minHeight: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          order: { xs: 1, sm: 2 },
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={() => window.open(data?.url_holder, "_blank")}
        >
          <OpenInNewRoundedIcon color="primary" sx={{ fontSize: "20px" }} />
        </IconButton>

        <Box
          sx={{
            width: 110,
            height: 110,
            backgroundColor: "#FFF",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #FFF",
          }}
        >
          <img
            src={image}
            alt="System"
            style={{ width: "80px", objectFit: "contain" }}
          />
        </Box>

        <IconButton
          onClick={handleCopy}
          sx={{ position: "absolute", bottom: 8, right: 8 }}
        >
          <ContentCopyRoundedIcon
            color={copied ? "success" : "primary"}
            sx={{ fontSize: "20px" }}
          />
        </IconButton>
      </CardContent>

      {/* Bottom Section (Mobile) / Left Section (Desktop) */}
      <CardContent
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingBottom: "60px !important",
          order: { xs: 2, sm: 1 },
        }}
      >
        <Stack spacing={1}>
          <Typography
            sx={{
              color: "#1A75BB",
              fontSize: "18px",
              fontWeight: "800",
              textAlign: { xs: "center", sm: "left" },
              // Prevent title from overlapping if it's too long
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.system_name}
          </Typography>

          <Typography
            sx={{
              color: "#858585",
              fontSize: "12px",
              lineHeight: "1.4",
              fontWeight: "400",
              textTransform: "lowercase",
              textAlign: { xs: "center", sm: "left" },
              "&::first-letter": { textTransform: "uppercase" },

              // --- CLAMPING LOGIC START ---
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4, // Limits text to 4 lines. Change this number to show more/less.
              // --- CLAMPING LOGIC END ---
            }}
          >
            {data?.description}
          </Typography>
        </Stack>

        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#F79A2E",
              "&:hover": { bgcolor: "#e68a1d" },
            }}
            onClick={() => {
              const query = encodeURIComponent(JSON.stringify(data));
              window.open(`/redirect?data=${query}`, "_blank");
            }}
          >
            Proceed
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
