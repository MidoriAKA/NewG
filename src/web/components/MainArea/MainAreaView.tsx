import * as style from "@styles/components/MainArea/MainArea";

export const MainAreaView = () => {
  return (
    <>
      <div
        className="main-area"
        css={style.Root}
      >
        <div
          className="main-area__content"
          css={style.Container}
        >
          <h1>Conteúdo</h1>
          <p>Conteúdo da área principal</p>
        </div>
      </div>
    </>
  );
};
