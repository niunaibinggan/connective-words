<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
  html {
    font-family: "Microsoft Yahei";
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
  *,
  html *,
  body * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Microsoft Yahei";
  }

  input,
  select,
  textarea {
    font-size: 100%;
  }

  fieldset,
  img {
    border: 0;
  }

  ol,
  ul {
    list-style: none;
  }

  input,
  button,
  select,
  textarea {
    outline: 0;
  }

  ::-webkit-input-placeholder {
    color: #5f6c65;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: #5f6c65;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: #5f6c65;
  }
  :-ms-input-placeholder {
    color: #5f6c65;
  }
</style>
