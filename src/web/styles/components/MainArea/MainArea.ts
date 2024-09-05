import { css, SerializedStyles } from "@emotion/react";
import * as theme from "@styles/root";

export const Root: SerializedStyles = css({
  backgroundColor: theme.Colors.black,
  display: "flex",
  width: "calc(100vw - 220px)",
  padding: "0 10px 10px 10px",
});
export const Container: SerializedStyles = css({
  ...theme.BGGrey,
  ...theme.VerticalCenter,
  flexDirection: "column",
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  overflow: "hide",
});
