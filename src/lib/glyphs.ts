export const MATRIX_GLYPHS =
  "01ｱｦｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎ{}[]<>=+*/".split("");

export function randomGlyph(): string {
  return MATRIX_GLYPHS[(Math.random() * MATRIX_GLYPHS.length) | 0];
}
