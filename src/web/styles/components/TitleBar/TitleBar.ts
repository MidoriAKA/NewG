import { css, SerializedStyles  } from "@emotion/react";

export const Container: SerializedStyles = css ({
  display: "flex",
  flexDirection: "row-reverse",
  alignContent: "center",
  alignItems: "center",
  height: "40px",
  width: "100%",
  backgroundColor: "#1e1e1e",
});

export const ButtonsWrapper: SerializedStyles = css ({
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "center",
  alignItems: "center",
  height: "40px",
  padding: "0 12px",
});

export const CloseButtonWrapper: SerializedStyles = css ({
  width: "16px",
  height: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "red",
  borderColor: "rgba(30,30,30,0.5)",
  margin: "0 6px",
});
export const CloseButton: SerializedStyles = css ({
  border: "none",
  backgroundColor: "transparent",
  color: "black",
  fontSize: "12px",
  fontWeight: "bold",
});

export const MinimizeButtonWrapper: SerializedStyles = css ({
  width: "16px",
  height: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "yellow",
  margin: "0 6px",
});
export const MinimizeButton: SerializedStyles = css ({
  border: "none",
  backgroundColor: "transparent",
  color: "black",
  fontSize: "20px",
});