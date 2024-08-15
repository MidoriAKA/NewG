import React from "react";
import * as style from "@styles/components/TitleBar/TitleBar";

export const TitleBarViewModel = () => {
  return (
    <div
      className="title-bar"
      css={style.Container}
      style={{
        color: "#1e1e1e",
      }}
    >
      <div
        className="title-bar__buttons-wrapper"
        css={style.ButtonsWrapper}
      >
        <div
          className="title-bar__close"
          css={style.CloseButtonWrapper}
        >
          <button
            onClick={() => {
              window.close();
            }}
            css={style.CloseButton}
          >
            ✕
          </button>
        </div>
        <div
          className="title-bar__minimize"
          css={style.MinimizeButtonWrapper}
        >
          <button
            onClick={() => {
              console.log("minimize");
            }}
            css={style.MinimizeButton}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};