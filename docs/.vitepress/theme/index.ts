import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./custom.css";
import TypeLink from "../../components/TypeLink.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("TypeLink", TypeLink);
  },
} satisfies Theme;
