/** Reads an image file and returns a small JPEG data URL (so avatars can live in localStorage). */
export function fileToDataURL(file, max = 320) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) return resolve("");
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(""); img.src = r.result;
    };
    r.onerror = () => resolve(""); r.readAsDataURL(file);
  });
}
