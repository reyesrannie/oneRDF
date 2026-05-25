import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setImportData,
  setImportError,
  setIsLoading,
} from "../../services/server/slice/modalSlice";
import image from "../../assets/svg/import.svg";
import fileError from "../../assets/svg/file-error.svg";
import excel from "../../assets/svg/excel.svg";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import DownloadIcon from "@mui/icons-material/Download";

import { readExcelFile } from "../../services/functions/readExcel";
import { useSnackbar } from "notistack";
import { exportToExcel } from "../../services/functions/exportExcel";

const ImportModal = ({
  title,
  importDataHandler,
  loading,
  importHeader = [],
  fileImport = false,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [fileName, setFileName] = useState("");
  const open = useSelector((state) => state.modal.import);
  const isLoading = useSelector((state) => state.modal.isLoading);
  const importData = useSelector((state) => state.modal.importData);
  const importError = useSelector((state) => state.modal.importError);

  const fileInputRef = useRef(null);

  const readFile = async (e) => {
    setFileName(null);
    dispatch(setImportError(false));
    dispatch(setImportData(null));

    const filesArray = Array.from(e.target.files);
    const file = filesArray[0];

    if (!file) return;
    setFileName(file.name);

    try {
      dispatch(setIsLoading(true));

      if (fileImport) {
        dispatch(setImportData(file));
      } else {
        const read = await readExcelFile(filesArray);
        dispatch(setImportData(read));
      }
    } catch (error) {
      enqueueSnackbar("This file is not supported", { variant: "error" });
      dispatch(setImportError(true));
    }
    dispatch(setIsLoading(false));
  };

  const readFileDrop = async (e) => {
    e.preventDefault();
    setFileName(null);
    dispatch(setImportError(false));
    dispatch(setImportData(null));

    const filesArray = e?.dataTransfer?.files;
    const file = filesArray[0];

    if (!file) return;
    setFileName(file.name);

    try {
      dispatch(setIsLoading(true));

      if (fileImport) {
        dispatch(setImportData(file));
      } else {
        const read = await readExcelFile(filesArray);
        dispatch(setImportData(read));
      }
    } catch (error) {
      enqueueSnackbar("This file is not supported", { variant: "error" });
      dispatch(setImportError(true));
    }
    dispatch(setIsLoading(false));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const exportTemplate = async () => {
    const templateColumns = importHeader.map((header) => ({
      header: header.value,
      key: header.name,
      width: 20,
    }));

    try {
      await exportToExcel([], templateColumns, `${title}_Template.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(resetModal());
      }}
    >
      <DialogTitle>
        <Typography fontWeight={700} color="text.secondary">
          Import
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          Upload a CSV to import {title?.toLowerCase()} data to database
        </Typography>
      </DialogTitle>
      <DialogContent onDragOver={handleDragOver} onDrop={readFileDrop}>
        <Box
          onClick={() => fileInputRef?.current?.click()}
          sx={{
            height: "200px",
            border: "2px dashed #E0E0E0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={importError ? fileError : importData ? excel : image}
            alt="import"
            className="import-list"
            draggable="false"
          />
          {importError ? (
            <Typography fontSize={10} color="text.secondary">
              File Not Supported
            </Typography>
          ) : importData ? (
            <Typography fontSize={10} color="text.secondary">
              Click import to upload {fileName}
            </Typography>
          ) : (
            <>
              <Typography fontSize={10} color="text.secondary">
                Drag & Drop
              </Typography>
              <Typography fontSize={10} color="text.secondary">
                or Browse
              </Typography>
              <Typography fontSize={10} color="text.secondary">
                only supports .xlsx
              </Typography>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={readFile}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </Box>
        {importHeader?.length !== 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="text"
              startIcon={<DownloadIcon />}
              onClick={(e) => {
                e.stopPropagation();
                exportTemplate();
              }}
              sx={{
                textTransform: "none",
                fontSize: "12px",
                fontWeight: 600,
                color: "primary.main",
                "&:hover": {
                  textDecoration: "underline",
                  bgcolor: "transparent",
                },
              }}
            >
              Download the template here
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Stack flexDirection={"row"} gap={1}>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<ClearOutlinedIcon sx={{ fontSize: 20 }} />}
            onClick={() => {
              dispatch(resetModal());
            }}
            sx={{
              fontSize: "12px",
            }}
          >
            Close
          </Button>
          <Button
            disabled={!importData || importError}
            loading={isLoading || loading}
            variant="contained"
            loadingPosition="start"
            startIcon={<ImportExportOutlinedIcon />}
            color="success"
            size="small"
            sx={{
              fontSize: "12px",
            }}
            onClick={() => importDataHandler()}
          >
            Import
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ImportModal;
