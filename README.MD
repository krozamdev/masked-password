# @krozamdev/masked-password

A lightweight and modern utility to mask input fields with password-like characters. This package is designed to prevent automatic storage in password managers while allowing easy retrieval of the original value. Perfect for cases where sensitive data needs to be handled in a custom way.

<p align="center">
  <a href="https://github.com/krozamdev/masked-password/actions"><img src="https://github.com/krozamdev/masked-password/actions/workflows/test-jest.yml/badge.svg" alt="Test & Build"></a>
  <a href="https://github.com/krozamdev/masked-password/actions"><img src="https://github.com/krozamdev/masked-password/actions/workflows/publish_npm.yml/badge.svg" alt="Publish NPM"></a>
  <a href="https://github.com/krozamdev/masked-password"><img src="https://codecov.io/gh/krozamdev/masked-password/graph/badge.svg?token=WH3SXSSMRA" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/@krozamdev/masked-password"><img src="https://img.shields.io/npm/v/@krozamdev/masked-password" alt="Latest Version"></a>
  <a href="https://www.npmjs.com/package/@krozamdev/masked-password"><img src="https://img.shields.io/npm/dt/@krozamdev/masked-password" alt="Total Download"></a>
  <a href="https://www.npmjs.com/package/@krozamdev/masked-password"><img src="https://img.shields.io/npm/l/@krozamdev/masked-password" alt="License"></a>
</p>

## Compatible Packages
<ul style="list-style: none; padding: 0; text-align: left;">
  <li>
    <a href="https://github.com/krozamdev/masked-password">
      <img src="https://img.shields.io/badge/vanillaJS-%40krozamdev%2Fmasked--password-F7DF1E?logo=javascript" alt="VanillaJS">
    </a>
  </li>
  <li>
    <a href="https://github.com/krozamdev/react-masked-password">
      <img src="https://img.shields.io/badge/React-%40krozamdev%2Freact--masked--password-61DAFB?logo=react" alt="React">
    </a>
  </li>
  <li>
    <a href="https://github.com/krozamdev/vue-masked-password">
      <img src="https://img.shields.io/badge/Vue-%40krozamdev%2Fvue--masked--password-42b883?logo=vuedotjs" alt="Vue">
    </a>
  </li>
  <li>
    <a href="https://github.com/krozamdev/svelte-masked-password">
      <img src="https://img.shields.io/badge/Svelte-%40krozamdev%2Fsvelte--masked--password-FF3E00?logo=svelte" alt="Svelte">
    </a>
  </li>
</ul>




---

## Features

- 🔒 Masks input fields in real-time using customizable characters (e.g., * or •).
- 📜 Allows retrieval of the original value without exposing it in the UI.
- ✅ Works seamlessly with JavaScript and TypeScript.
- 🚀 Lightweight and easy to integrate with any frontend framework.
- 💡 Prevents password managers from saving sensitive input values.

---

## Installation

- npm
    ```shell
    npm install @krozamdev/masked-password
    ```

- yarn
    ```shell
    yarn add @krozamdev/masked-password
    ```

- pnpm
    ```shell
    pnpm add @krozamdev/masked-password
    ```

- bun
    ```shell
    bun add @krozamdev/masked-password
    ```

---

## Usage

### Basic Example ESModule `TS`

By default, the masking character is •, and the original value can be retrieved using the provided method.

```ts
import { applyMaskedInput } from '@krozamdev/masked-password';

const inputElement = document.getElementById("passwordInput") as HTMLInputElement;
const maskedInput = applyMaskedInput(inputElement);

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### Custom Mask Character `TS`

You can also provide a custom mask character, such as `*`, by passing it as a configuration option.

```ts
import { applyMaskedInput } from '@krozamdev/masked-password';

const inputElement = document.getElementById("passwordInput") as HTMLInputElement;
const maskedInput = applyMaskedInput(inputElement , { character: '*' });

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### HTML Example

```html
<input type="text" id="passwordInput" />
<button id="btn">Show Log</button>
<script type="module">
  import { applyMaskedInput } from '@krozamdev/masked-password';

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '*' });

  // To get the original value
  document.getElementById("btn").addEventListener("click", function () {
    console.log(maskedInput.getOriginalValue());
  });
</script>
```

### Browser Example

```html
<input type="text" id="passwordInput" />
<button id="btn">Show Log</button>
<script type="module">
  import { applyMaskedInput } from 'https://cdn.jsdelivr.net/npm/@krozamdev/masked-password/dist/index.esm.min.js';

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '*' });

  // To get the original value
  document.getElementById("btn").addEventListener("click", function () {
    console.log(maskedInput.getOriginalValue());
  });
</script>
```

---

## CommonJS Example

In CommonJS, you can use require to import the module.

### Default Mask (`•`):

```js
const { applyMaskedInput } = require('@krozamdev/masked-password');

const inputElement = document.getElementById('passwordInput');
const maskedInput = applyMaskedInput(inputElement);

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### Custom Mask (`*`):

```js
const { applyMaskedInput } = require('@krozamdev/masked-password');

const inputElement = document.getElementById('passwordInput');
const maskedInput = applyMaskedInput(inputElement, { character: '*' });

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### HTML Example `in bundle only`

```html
<input type="text" id="passwordInput" />
<button id="btn">Show Log</button>
<script type="module">
  const { applyMaskedInput } = require('@krozamdev/masked-password');

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '*' });

  // To get the original value
  document.getElementById("btn").addEventListener("click", function () {
    console.log(maskedInput.getOriginalValue());
  });
</script>
```

### Destroy & add Event `in bundle only`
```html
<input type="text" id="passwordInput" />
<button id="eye_btn">Eye Button</button>
<button id="btn">Show Log</button>
<script type="module">
  const { applyMaskedInput } = require('@krozamdev/masked-password');

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '*' });

  let show = false;
  const eyeBtn = document.getElementById("eye_btn");
  eyeBtn.addEventListener("click", function () {
    if (show) {
      eyeBtn.style.textDecoration = "line-through";
      maskedInput.addEvent();
    }else{
      eyeBtn.style.textDecoration = "none";
      maskedInput.destroy();
    }
    show = !show
  });

  document.getElementById("btn").addEventListener("click", function () {
    console.log(maskedInput.getOriginalValue());
  });
</script>
```

---

### Browser Support

omit the version completely to get the latest one
you should NOT use this in production

```html
<script src="https://cdn.jsdelivr.net/npm/@krozamdev/masked-password/dist/index.umd.min.js"></script>
<input type="text" id="passwordInput" />
<button id="btn">Show Log</button>
<script>
  const inputElement = document.getElementById("passwordInput");
  const maskedInput = MaskedPassword.applyMaskedInput(inputElement, {
    character: "•",
  });

  document.getElementById("btn").addEventListener("click", function () {
    console.log(maskedInput.getOriginalValue());
  });
</script>
```

### Example Code

[Example code](samples/index.html)

---

### Options

- `character` (optional): The character to use for masking the input field. Default is `*`.
- `onChange` (optional): The `onChange` configuration is a callback function that is triggered whenever the original input value changes, whether the user types or pastes text. This function receives the unmasked value before applying the mask, allowing developers to access and process the raw input.

### Methods

1. `getOriginalValue()`:
    - This function returns the original unmasked value of the input field. For example, if the input has a masking format (like a phone number with parentheses and dashes), this function will return the raw, unformatted value without any masking.
2. `destroy()`:
    - This function removes the registered event listeners from the input element, restores the original value, and disables the masking feature.
    - The `destroy()` method checks certain conditions (like whether the `onChange` configuration exists), allowing the logic of the event handling to be adjusted or replaced before fully destroying the masking.
3. `addEvent()`:
    - This function re-registers the event listeners on the input element, making it easier to re-enable the masking after it has been destroyed. This method is useful if you temporarily disable masking and later want to re-enable it without losing the initial setup or logic.
4. `purgeDestroy()`:
    - This function is similar to `destroy()`, but it removes all registered event listeners from the input element without checking any conditions. It restores the original value and disables masking completely.
    - The key difference is that `purgeDestroy()` aggressively removes event listeners and masking without considering additional configurations or conditions.

#### Key Differences:

- `destroy()` takes into account specific conditions (such as the existence of the `onChange` configuration), allowing more control over the event handling before removing the masking.
- `purgeDestroy()` is more direct and forceful in that it removes all event listeners and deactivates masking without checking any conditions.

#### When to Use:

- Use `destroy()` if you need finer control or need to consider additional configurations (e.g., `onChange`) before disabling the masking.
- Use `purgeDestroy()` if you want to completely reset the input element without considering any conditions or logic.

#### Example Use Cases:

- `destroy()`: Used when you want to stop masking but still retain logic related to value changes (`onChange`).
- `purgeDestroy()`: Used when you want to fully reset the input element and remove masking without regard to existing logic or configurations.

---

### License
[MIT LICENSE](LICENSE)
