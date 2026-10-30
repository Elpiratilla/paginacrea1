// Prueba de la tabla Braille. Correr con:  node --test tests/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { BRAILLE_PUNTOS, puntosDe, textoABraille } = require("../es/js/braille.js");

// referencia escrita a mano, carácter por carácter, desde el bloque Unicode de Braille
const ESPERADO = {
    a:"⠁", b:"⠃", c:"⠉", d:"⠙", e:"⠑", f:"⠋", g:"⠛", h:"⠓", i:"⠊", j:"⠚",
    k:"⠅", l:"⠇", m:"⠍", n:"⠝", "ñ":"⠻", o:"⠕", p:"⠏", q:"⠟", r:"⠗", s:"⠎",
    t:"⠞", u:"⠥", v:"⠧", w:"⠺", x:"⠭", y:"⠽", z:"⠵",
    "á":"⠷", "é":"⠮", "í":"⠌", "ó":"⠬", "ú":"⠾", "ü":"⠳"
};

test("cada letra tiene los puntos correctos", () => {
    for (const [letra, unicode] of Object.entries(ESPERADO)) {
        assert.equal(textoABraille(letra), unicode, `letra ${letra}`);
    }
});

test("no hay letras de más ni de menos", () => {
    assert.deepEqual(Object.keys(BRAILLE_PUNTOS).sort(), Object.keys(ESPERADO).sort());
});

test("mayúsculas, espacios y números", () => {
    assert.equal(textoABraille("Hola 12"), "⠓⠕⠇⠁ ⠼⠁⠃");
    assert.equal(textoABraille("a1b2"), "⠁⠼⠁⠃⠼⠃");
});

test("lo que no está en la tabla queda igual", () => {
    assert.equal(textoABraille("@"), "@");
    assert.equal(puntosDe("@"), null);
});
