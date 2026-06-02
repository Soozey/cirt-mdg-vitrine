import QRCode from "qrcode";

export async function downloadQrCodePng({
  payload,
  fileName,
}: {
  payload: string;
  fileName: string;
}) {
  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 8,
    color: {
      dark: "#03124a",
      light: "#ffffff",
    },
  });
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  anchor.click();
}
