import { css, SerializedStyles } from "@emotion/react";
import { Colors, BGBlack, HorizontalCenter, VerticalCenter, BGWhite } from "../../root";

export const Container: SerializedStyles = css({
  ...HorizontalCenter,
  ...BGBlack,
  flexDirection: "column",
  alignContent: "center",
  height: "calc(100dvh - 41px)",
  width: "200px",
});

const ItemWrapperBase = {
  ...VerticalCenter,
  justifyContent: "unset",
  alignContent: "center",
  border: "none",
  height: "auto",
  width: "90%",
  minHeight: "40px"
};
export const ItemWrapper: SerializedStyles = css({
  ...ItemWrapperBase,
  ...BGBlack,
});
export const ItemWrapperActive: SerializedStyles = css({
  ...ItemWrapperBase,
  ...BGWhite,
  borderRadius: "10px"
});
export const ItemIcon: SerializedStyles = css({
  ...VerticalCenter,
  height: "100%",
  width: "50px",
  "span": {
  fontSize: "20px",
  marginRight: "10px",
  }
});
export const ItemText: SerializedStyles = css({
  fontSize: "16px",
  margin: "0 10px",
});

