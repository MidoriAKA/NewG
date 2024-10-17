import { css, SerializedStyles } from "@emotion/react";
import * as theme from "@styles/root";

export const Root: SerializedStyles = css({
  backgroundColor: theme.Colors.black,
  display: "flex",
  width: "-webkit-fill-available",
  height: "50px",
  padding: "10px",
  margin: "10px 0 10px 0",
  borderRadius: "10px",
});

export const Search: SerializedStyles = css({
  width: "300px",
  height: "-webkit-fill-available",
  borderRadius: "10px",
  padding: "0 13px 0 13px",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  border: `4px solid ${theme.Colors.grey}`,
  color: theme.Colors.white,
});

