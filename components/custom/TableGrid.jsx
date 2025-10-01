import {
  Button,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import "../styles/TableGrid.scss";

import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";

const TableGrid = ({ header = [], items = [], onSelect, onView, onSync }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {header?.map((head, index) => {
              return (
                <TableCell key={index} align={head?.alignHeader}>
                  <Stack
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={head?.alignHeader}
                  >
                    {head?.type !== "box" && (
                      <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
                        {head?.name}
                      </Typography>
                    )}
                    {head?.type === "box" && (
                      <Checkbox
                        defaultChecked={false}
                        size="small"
                        sx={{
                          color: "#000000",
                        }}
                      />
                    )}
                    {head.wSort && (
                      <IconButton>
                        <ArrowDownwardIcon
                          sx={{
                            fontSize: "14px",
                            color: "#000000",
                          }}
                        />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.data?.map((i, ind) => {
            return (
              <TableRow
                key={ind}
                onClick={(e) => {
                  onSelect(e, i);
                }}
              >
                {header?.map((head, index) => {
                  const key = i?.id;
                  return (
                    <TableCell key={index} align={head?.alignHeader}>
                      {head?.type === undefined && (
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {i[head?.value]}
                        </Typography>
                      )}
                      {head?.type === "multimedia" && (
                        <Stack
                          gap={1}
                          flexDirection={"row"}
                          alignItems={"center"}
                        >
                          <Typography
                            color="text.secondary"
                            sx={{
                              fontSize: "12px",
                            }}
                          >
                            {i[head?.value]}
                          </Typography>
                        </Stack>
                      )}
                      {head?.type === "date" && (
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {moment(new Date(i[head?.value])).format(
                            "MMM DD, YYYY"
                          )}
                        </Typography>
                      )}
                      {head?.type === "parent" && (
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {i[head.value]?.[head.child]}
                        </Typography>
                      )}

                      {head?.type === "multiple" && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(i);
                          }}
                        >
                          <InsertLinkOutlinedIcon />
                        </IconButton>
                      )}

                      {head?.type === "sync" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSync(i);
                          }}
                          variant="contained"
                          color="success"
                          startIcon={<CloudSyncOutlinedIcon />}
                          size="small"
                        >
                          Sync
                        </Button>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableGrid;
