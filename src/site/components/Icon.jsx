import { GLYPHS } from "./glyphs.jsx";
/** Renders one of the shared glyphs inside a wrapper element (default <i>), matching the original `data-ic` markup. */
export default function Icon({ name, tag: Tag = "i", ...rest }) {
  return (
    <Tag {...rest}>
      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[name]}</svg>
    </Tag>
  );
}
