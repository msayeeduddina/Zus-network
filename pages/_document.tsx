import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          defer
          src="https://cdn.jsdelivr.net/gh/herumi/bls-wasm@v1.0.0/browser/bls.js"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/gh/golang/go@go1.20.4/misc/wasm/wasm_exec.js"
        />
        <script
          defer
          src="https://github.com/videojs/mux.js/releases/latest/download/mux.js"
        />
      </Head>
      <body>
        <div id="modal" />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
