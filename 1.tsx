const downloadPNG = () => {
  if (!chartAreaRef.current) return;

  const svgElement = chartAreaRef.current.querySelector("svg");
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "chart.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    URL.revokeObjectURL(url);
  };

  img.src = url;
};
