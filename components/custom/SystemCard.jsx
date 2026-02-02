import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const SystemCard = ({ data }) => {
  const systemImage = useSelector((state) => state.modal.systemImage);
  const [currentIndex, setCurrentIndex] = useState(null);
  const image = systemImage?.find((img) => img?.id === data?.id)?.url;
  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateColumns: "40% 60%",
        maxWidth: "450px",
        minWidth: "450px",
        minHeight: "200px",
      }}
    >
      <CardContent
        sx={{
          position: "relative",
        }}
      >
        <Stack>
          <Typography
            sx={{
              color: "#1A75BB",
              lineHeight: "24px",
              fontSize: "18px",
              fontWeight: "800",
            }}
          >
            {data?.system_name}
          </Typography>
        </Stack>
        <Stack>
          <Typography
            sx={{
              color: "#858585",
              fontSize: "7px",
              lineHeight: "11px",
              fontWeight: "400",
              letterSpacing: "-0.07px",
            }}
          >
            THIS SYSTEM IS AN AUTOMATED PETTY CASH FUND THAT PERFORMS CASH
            ADVANCE, LIQUIDATION AND REIMBURSEMENT. IT CAN HELP TO INCREASE THE
            EFFICIENCY AND PROVIDE BETTER MONITORING OF PETTY CASH FUND. THE
            SYSTEM IS SUPPORTED BY MOBILE, TABLET AND COMPUTERS THAT CAN ACCESS
            OUTSIDE THE COMPANY.”
          </Typography>
        </Stack>

        <Stack
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#F79A2E",
            }}
            onClick={() => {
              const query = encodeURIComponent(JSON.stringify(data));
              window.open(`/redirect?data=${query}`, "_blank");
            }}
          >
            Proceed
          </Button>
        </Stack>
      </CardContent>

      <CardContent
        sx={{
          position: "relative",
          borderRadius: "5px",
          background: "linear-gradient(233deg, #FFF 40.37%, #F6931E 128.97%)",
          boxShadow: "4px 4px 3.8px rgba(0, 0, 0, 0.25)",
          minHeight: "130px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 1,
          }}
        >
          <OpenInNewRoundedIcon
            color="primary"
            sx={{
              fontSize: "20px",
            }}
          />
        </IconButton>
        <Box
          sx={{
            width: 130,
            height: 130,
            backgroundColor: "#FFF",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={image}
            style={{
              width: "100px",
            }}
          />
        </Box>
        <Stack
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {/* <Tooltip title={currentIndex === ind ? "Copied" : "Click to copy"}> */}
          <IconButton
            onClick={() => {
              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard
                  .writeText(data?.url_holder || "")
                  .then(() => setCurrentIndex(ind))
                  .catch((err) => console.error("Copy failed:", err));
              } else {
                const textarea = document.createElement("textarea");
                textarea.value = data?.url_holder || "";
                textarea.style.position = "fixed";
                textarea.style.left = "-9999px";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                  const success = document.execCommand("copy");
                  if (success) setCurrentIndex(ind);
                  else console.error("Fallback copy command failed");
                } catch (err) {
                  console.error("Fallback copy failed:", err);
                }
                document.body.removeChild(textarea);
              }
            }}
          >
            <ContentCopyRoundedIcon
              color="primary"
              sx={{
                fontSize: "20px",
              }}
            />
          </IconButton>
          {/* </Tooltip> */}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
