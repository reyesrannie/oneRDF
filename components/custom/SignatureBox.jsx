import SignatureCanvas from "react-signature-canvas";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const SignatureBox = forwardRef((props, ref) => {
  const sigRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clear: () => sigRef?.current?.clear(),
    getImage: () => sigRef?.current?.getTrimmedCanvas()?.toDataURL("image/png"),
    isEmpty: () => sigRef?.current?.isEmpty(),
  }));

  return (
    <Stack width="100%">
      <Stack
        flexDirection="row"
        gap={2}
        mt={1}
        alignItems="center"
        width="100%"
      >
        <Box
          sx={{
            width: "100%",
            height: 100,
            border: "2px dashed #9e9e9e",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => sigRef?.current?.clear()}
          >
            <ClearOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
          </IconButton>

          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{
              width: 800,
              height: 100,
              style: { backgroundColor: "transparent" },
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
});

export default SignatureBox;
