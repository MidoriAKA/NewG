import { SerializedStyles, css } from "@emotion/react";
import * as theme from "@styles/root";

export const Container: SerializedStyles = css({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

export const Table: SerializedStyles = css({
  width: "100%",
  borderCollapse: "collapse",
  borderSpacing: "0",
});

export const TableHeader: SerializedStyles = css({
  ...theme.BGWhite,
  fontWeight: "bold",
  position: "sticky",
  top: "0",
});

export const TableRow: SerializedStyles = css({
  "&:nth-of-type(even)": {
    ...theme.BGBlack
  },
});

export const TableCell_Title: SerializedStyles = css({
  padding: "10px",
  border: `1px solid ${theme.Colors.white}`,
  textAlign: "left",
  fontSize: "14px",
  color: theme.Colors.white,
  maxWidth: "200px",
});

export const TableCell: SerializedStyles = css({
  padding: "10px",
  border: `1px solid ${theme.Colors.white}`,
  textAlign: "left",
  fontSize: "14px",
  color: theme.Colors.white,
});