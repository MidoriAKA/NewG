import { css, SerializedStyles } from "@emotion/react";
import * as theme from "@styles/root";

export const Container: SerializedStyles = css({
  ...theme.HorizontalCenter,
  ...theme.BGBlack,
  flexDirection: "column",
  alignContent: "center",
  height: "calc(100dvh - 41px)",
  width: "200px",
});

export const Section: SerializedStyles = css({
  ...theme.VerticalCenter,
  justifyContent: "unset",
  height: "40px",
  width: "150px",
  padding: "0 10px",
});
export const SectionText: SerializedStyles = css({
  fontSize: "16px",

});

const ItemWrapperBase = {
  ...theme.VerticalCenter,
  justifyContent: "unset",
  alignContent: "center",
  border: "none",
  height: "auto",
  width: "85%",
  minHeight: "40px"
};
export const ItemWrapper: SerializedStyles = css({
  ...ItemWrapperBase,
  ...theme.BGBlack,
  color: `rgba(${theme.ColorsRGB.white}, 0.8)`,
});
export const ItemWrapperActive: SerializedStyles = css({
  ...ItemWrapperBase,
  ...theme.BGWhite,
  borderRadius: "10px"
});

export const ItemIcon: SerializedStyles = css({
  ...theme.VerticalCenter,
  height: "100%",
  width: "30px",
  marginRight: "10px",
  "span": {
    fontSize: "20px",
    transform: "translateY(-2px)",
  }
});
export const ItemText: SerializedStyles = css({
  fontSize: "15px",
  fontWeight: "bold"
});

