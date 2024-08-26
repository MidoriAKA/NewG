import React from "react";
import * as style from "@styles/components/TitleBar/TitleBar";
import { TitleBarViewModel } from "./TitleBarViewModel";

export const TitleBarView = () => {
  const { buttonsEvents } = TitleBarViewModel();
  return (
    <div
      className="title-bar"
      css={style.Container}
    >
      <div
        className="title-bar__buttons-wrapper"
        css={style.ButtonsWrapper}
      >
        <div
          className="title-bar__close"
          css={style.Button}
        >
          <button
            onClick={() => {
              buttonsEvents("close");
            }}
            css={style.CloseButton}
          >
            ✕
          </button>
        </div>
        <div
          className="title-bar__maximize"
          css={style.Button}
        >
          <button
            onClick={() => {
              buttonsEvents("maximize");
            }}
            css={style.MaximizeButton}
          >
            □
          </button>
        </div>
        <div
          className="title-bar__minimize"
          css={style.Button}
        >
          <button
            onClick={() => {
              buttonsEvents("minimize");
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