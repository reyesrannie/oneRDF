import {
  Button,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import moment from "moment";
import "../styles/TableGrid.scss";

import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";

const filterList = [
  {
    name: "ID number",
    value: "id_no",
  },
];

const TableGrid = ({
  header = [],
  items = [],
  onSelect,
  onView,
  onSync,
  params = null,
  onSort,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {header?.map((head, index) => {
              const sortKey =
                head?.type === "concat" ? head?.sort : head?.value;
              const isSorted =
                params?.sorts === sortKey || params?.sorts === `-${sortKey}`;
              const isDescending = params?.sorts === `-${sortKey}`;

              return (
                <TableCell key={index} align={head?.alignHeader}>
                  <TableSortLabel
                    active={isSorted}
                    // If descending, use 'desc', otherwise 'asc'
                    direction={isDescending ? "desc" : "asc"}
                    sx={{
                      color: "#000 !important",
                      "& .MuiTableSortLabel-icon": {
                        opacity: 0,
                      },
                    }}
                    onClick={() => {
                      const nextSort =
                        params?.sorts === sortKey ? `-${sortKey}` : sortKey;

                      onSort(nextSort);
                    }}
                  >
                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={head?.alignHeader}
                    >
                      {head?.type !== "box" && (
                        <Typography
                          sx={{ fontSize: "12px", fontWeight: "bold" }}
                        >
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
                    </Stack>
                  </TableSortLabel>
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

                      {head?.type === "days" && (
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {`${i[head?.value]} ${i[head?.value] > 1 ? "days" : "day"}`}
                        </Typography>
                      )}

                      {head?.type === "concat" && (
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: "12px" }}
                        >
                          {Array.isArray(head.value)
                            ? head.value
                                .map((field) =>
                                  i[field] === "N/A" ? "" : i[field],
                                )
                                .filter(Boolean)
                                .join(" ")
                            : i[head.value] === "N/A"
                              ? ""
                              : i[head.value]}
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
                            "MMM DD, YYYY",
                          )}
                        </Typography>
                      )}
                      {head?.type === "dateTime" && (
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {moment(new Date(i[head?.value])).format(
                            "MMM DD, YYYY hh:mm A",
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
