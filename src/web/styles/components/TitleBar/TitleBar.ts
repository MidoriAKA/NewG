import { css, SerializedStyles  } from "@emotion/react";
import { Colors, BGBlack, HorizontalCenter, VerticalCenter, BGWhite } from "../../root";
import { ButtonsStyle, ButtonsWrapperStyle } from "./buttons";

export const Container: SerializedStyles = css ({
  ...HorizontalCenter,
  ...BGBlack,
  flexDirection: "row-reverse",
  alignContent: "center",
  height: "40px",
  width: "100%",
});

export const ButtonsWrapper: SerializedStyles = css ({
  ...VerticalCenter,
  flexDirection: "row-reverse",
  height: "40px",
  padding: "0 12px",
});

export const Button: SerializedStyles = css ({
  ...ButtonsWrapperStyle,
  ...VerticalCenter,
  ...BGWhite,
  '&.title-bar__close:hover': {
    backgroundColor: Colors.red
  },
  '&.title-bar__maximize:hover': {
    backgroundColor: Colors.green
  },
  '&.title-bar__minimize:hover': {
    backgroundColor: Colors.yellow
  }
});

export const CloseButton: SerializedStyles = css ({
  ...ButtonsStyle,
  fontSize: "12px",
  fontWeight: "bold",
});
export const MaximizeButton: SerializedStyles = css ({
  ...ButtonsStyle,
  fontSize: "20px",
  fontWeight: "bold",
  paddingBottom: "5px",
});
export const MinimizeButton: SerializedStyles = css ({
  ...ButtonsStyle,
  fontSize: "20px",
  paddingBottom: "3px",
});