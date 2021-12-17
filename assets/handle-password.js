// used by recordings.html

const keys = await fetch(new URL("/keys.json", mediaHost)).then((res) =>
  res.json()
);

const Base64 = window["base64-arraybuffer"];

const makeIv = (path) =>
  crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(path))
    .then((buf) => buf.slice(0, 16));

document.querySelector(".decrypt-button").disabled = false;
globalThis.decrypt = async () => {
  passwordInput.classList.remove("is-invalid");
  passwordInput.setCustomValidity("");

  const keyData = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(passwordInput.value)
  );
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const decoder = new TextDecoder();
  const extractedKeys = await Promise.all(
    keys.map(({ iv, data }) =>
      crypto.subtle
        .decrypt(
          { name: "AES-CBC", iv: Base64.decode(iv) },
          passwordKey,
          Base64.decode(data)
        )
        .then((jwk) =>
          crypto.subtle.importKey(
            "jwk",
            JSON.parse(decoder.decode(jwk)),
            { name: "AES-CBC" },
            false,
            ["decrypt"]
          )
        )
        .then(
          (key) => ({ success: true, key }),
          (error) => ({ success: false, error })
        )
    )
  );

  const key = extractedKeys.find((k) => k.success)?.key;
  if (key) {
    globalThis.decryptionKey = key;
    const inventory = await fetch(new URL("/inventory.json", mediaHost))
      .then((res) => res.arrayBuffer())
      .then(async (data) =>
        crypto.subtle.decrypt(
          {
            name: "AES-CBC",
            iv: await makeIv("inventory.json"),
          },
          key,
          data
        )
      )
      .then((decrypted) => JSON.parse(decoder.decode(decrypted)));
    console.log(inventory);
  } else {
    passwordInput.classList.add("is-invalid");
    passwordInput.setCustomValidity(
      "Incorrect Password. Try again or email band_web@brown.edu!"
    );
  }
};
