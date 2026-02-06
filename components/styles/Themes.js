import { colors, createTheme } from "@mui/material";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const Themes = () => {
  const mode = useSelector((state) => state.theme.mode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#1A75BB",
                },
                secondary: {
                  main: "#594a43",
                },
                info: {
                  main: "#F79A2E",
                },
                background: {
                  default: "#1A75BB",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#000000",
                },
                error: {
                  main: "#ff6b6b",
                },
                action: {
                  disabled: "#464741",
                },
                divider: "#ffffff",
              }
            : {
                primary: {
                  main: "#ECDFCC",
                },
                secondary: {
                  main: "#697565",
                },
                error: {
                  main: "#FF5C58",
                },
                info: {
                  main: "#464741",
                },
                text: {
                  primary: "#f0e7c4",
                },
                background: {
                  default: "#181C14",
                  paper: "#3C3D37",
                },
              }),
        },
        typography: {
          fontFamily: "Montserrat",
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: "#1A75BB",
              },
            },
          },

          MuiListItemButton: {
            styleOverrides: {
              root: {
                marginLeft: 8,
                marginRight: 8,
                marginBottom: 1,
                borderRadius: 8,
                backgroundColor: "#FFFFFF",
                "&.Mui-selected": {
                  backgroundColor: "#1A75BB",
                },
                "&:hover": {
                  backgroundColor: "#1A75BB",
                  "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                    color: "#FFFFFF",
                  },
                },
              },
            },
          },

          MuiListItemIcon: {
            styleOverrides: {
              root: {
                minWidth: 0,
                justifyContent: "center",
                marginRight: 12,
                color: "#1A75BB",
                "& svg": {
                  fontSize: "18px",
                },
              },
            },
          },

          MuiListItemText: {
            styleOverrides: {
              root: {
                color: "#17619A",
                "& .MuiTypography-root": {
                  fontSize: "12px",
                },
                transition: "opacity 0.3s",
              },
            },
          },

          MuiBottomNavigationAction: {
            styleOverrides: {
              root: {
                color: "#000000",
                "&.Mui-selected": {
                  backgroundColor: mode === "light" ? "#000000" : "#50514A",
                  color: mode === "light" ? "#ffffff" : "#ECDFCC",
                  borderRadius: "8px",
                },
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                fontSize: "10px",
                "& .MuiSvgIcon-root": {
                  fontSize: "14px",
                },
                textTransform: "capitalize",
              },
            },
          },
          MuiSkeleton: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#ffffff" : "#ECDFCC", // Change to any color you want
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              root: {
                "& .MuiInputBase-root": {
                  minHeight: 40,
                  "& input::placeholder": {
                    fontSize: "12px",
                  },
                  "& input": {
                    fontSize: "12px",
                  },
                },
                "& .MuiInputLabel-shrink": {
                  fontSize: "10px",
                },
                "& .MuiChip-root": {
                  fontSize: "10px",
                  backgroundColor: "#1A75BB",
                },
              },
              listbox: {
                fontSize: "12px",
                color: "#496D89",
              },
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: mode === "light" ? "#F79A2E" : "#f0e7c4",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: mode === "light" ? "#F79A2E" : "#f0e7c4",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: mode === "light" ? "#F79A2E" : "#f0e7c4",
                },
                "& .MuiInputBase-input": {
                  color: mode === "light" ? "#496D89" : "#f0e7c4",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#496D89" : "#f0e7c4",
                fontSize: "14px",
                "&.Mui-focused": {
                  color: "#496D89",
                },
              },
            },
          },
          MuiInputAdornment: {
            styleOverrides: {
              root: {
                color: "#A0A0A0",
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: {
                backgroundColor: "#FFFFFF",
                maxHeight: "calc(100vh - 600px)",
                minHeight: "calc(100vh - 440px)",
                // maxWidth: "calc(100vw - 370px)",
                borderRadius: 1,
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                position: "sticky",
                top: 0,
                backgroundColor: "#FFFFFF",
                "& .MuiTableCell-head": {
                  color: "#000000",
                  padding: 0,
                  whiteSpace: "nowrap",
                  width: "1%",
                  borderBottom: "1px solid #1A75BB",
                },
              },
            },
          },
          MuiTableBody: {
            styleOverrides: {
              root: {
                cursor: "pointer",
                "& .MuiTableCell-root": {
                  padding: 4,
                  borderBottom: "1px solid #1A75BB",
                },
                "& .MuiTableRow-root:nth-of-type(odd)": {
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#8C8D84",
                  },
                },
                "& .MuiTableRow-root:nth-of-type(even)": {
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#8C8D84",
                  },
                },
              },
            },
          },

          MuiTableFooter: {
            styleOverrides: {
              root: {
                backgroundColor: "#1A75BB",
                paddding: 0,
                "& .MuiTableCell-root": {
                  paddding: 0,
                  fontWeight: "bold",
                  borderTop: "1px solid #1A75BB",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                cursor: "pointer",
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#424242" : "#3C3D37",
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: "#ffffff",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                fontSize: "12px",
                color: "#1A75BB",
                "&.Mui-selected": {
                  backgroundColor: "#E3F2FD",
                },
                "&:hover": {
                  backgroundColor: "#1976D2",
                  color: "#fff",
                },
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                backgroundColor: "#1A75BB",
                "& .MuiTablePagination-selectLabel": {
                  margin: 0,
                  fontSize: "12px",
                },
                "& .MuiTablePagination-toolbar": {
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "12px",
                  minHeight: "0px",
                },
                "& .MuiTablePagination-displayedRows": {
                  color: "#ffffff",
                  margin: 0,
                  fontSize: "12px",
                },
                "& .MuiTablePagination-selectIcon": {
                  color: "#ffffff",
                  fontSize: "12px",
                },
                "& .MuiSelect-icon": {
                  color: "#ffffff",
                  fontSize: "14px",
                },

                "& .MuiIconButton-root": {
                  color: "#ffffff",

                  "&.Mui-disabled": {
                    color: "#ffffff",
                  },

                  "& .MuiSvgIcon-root": {
                    fontSize: "14px",
                  },
                },
              },
            },
          },
          MuiPaginationItem: {
            styleOverrides: {
              root: {
                color: "#ffffff",
                "&.Mui-selected": {
                  backgroundColor: "#1A75BB",
                  color: "#ffffff",
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return { theme };
};
