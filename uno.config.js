import {
  defineConfig,
  presetUno,
  presetIcons,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";
import { colors } from "@unocss/preset-wind";
import { presetForms } from "@julr/unocss-preset-forms";

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {
      primary: colors.indigo
    }
  },
  presets: [
    presetUno(),
    presetForms(),
    presetWebFonts({
      fonts: {
        "dancing-script": ["Dancing Script:400"]
      }
    }),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "pointer-events": "none",
        "vertical-align": "middle",
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
