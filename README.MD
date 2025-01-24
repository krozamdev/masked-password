# @krozamdev/masked-password

A lightweight and modern utility to mask input fields with password-like characters. This package is designed to prevent automatic storage in password managers while allowing easy retrieval of the original value. Perfect for cases where sensitive data needs to be handled in a custom way.

<p align="center">
  <a href="https://www.npmjs.com/package/@krozamdev/masked-password"><img src="https://img.shields.io/npm/v/@krozamdev/masked-password" alt="Latest Version"></a>
  <a href="https://www.npmjs.com/package/@krozamdev/masked-password"><img src="https://img.shields.io/npm/dt/@krozamdev/masked-password" alt="Total Download"></a>
  <a href="https://www.npmjs.com/package/@krozamdev/masked-password"><img src="https://img.shields.io/npm/l/@krozamdev/masked-password" alt="License"></a>
</p>

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

### Basic Example ESModule

By default, the masking character is *, and the original value can be retrieved using the provided method.

```ts
import { applyMaskedInput } from '@krozamdev/masked-password';

const inputElement = document.getElementById("passwordInput") as HTMLInputElement;
const maskedInput = applyMaskedInput(inputElement);

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### Custom Mask Character

You can also provide a custom mask character, such as `•`, by passing it as a configuration option.

```ts
import { applyMaskedInput } from '@krozamdev/masked-password';

const inputElement = document.getElementById("passwordInput") as HTMLInputElement;
const maskedInput = applyMaskedInput(inputElement, { character: "•" });

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### HTML Example

```html
<input type="text" id="passwordInput" />
<script type="module">
  import { applyMaskedInput } from '@krozamdev/masked-password';

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '•' });

  // To get the original value
  console.log(maskedInput.getOriginalValue());
</script>
```

---

## CommonJS Example

In CommonJS, you can use require to import the module.

### Default Mask (`*`):

```js
const { applyMaskedInput } = require('@krozamdev/masked-password');

const inputElement = document.getElementById('passwordInput');
const maskedInput = applyMaskedInput(inputElement);

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### Custom Mask (`•`):

```js
const { applyMaskedInput } = require('@krozamdev/masked-password');

const inputElement = document.getElementById('passwordInput');
const maskedInput = applyMaskedInput(inputElement, { character: '•' });

console.log(maskedInput.getOriginalValue()); // Original value of input
```

### HTML Example

```html
<input type="text" id="passwordInput" />
<script type="module">
  const { applyMaskedInput } = require('@krozamdev/masked-password');

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '•' });

  // To get the original value
  console.log(maskedInput.getOriginalValue());
</script>
```

### Destroy & add Event
```html
<input type="text" id="passwordInput" />
<button id="eye_btn">Eye Button</button>
<button id="btn">Show Log</button>
<script type="module">
  const { applyMaskedInput } = require('@krozamdev/masked-password');

  const inputElement = document.getElementById('passwordInput');
  const maskedInput = applyMaskedInput(inputElement, { character: '•' });

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

---

### Options

`character` (optional): The character to use for masking the input field. Default is `*`.

### Methods

* `getOriginalValue()`: Returns the original unmasked value of the input.
* `destroy()`: Introduced a method to remove registered event listeners from the input element, restore the original value, and deactivate masking.
* `addEvent()` : Introduced a method to re-register event listeners on the input element, making it easier to re-enable masking after being destroyed. 

### License

**MIT**