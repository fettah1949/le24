import Image, { type ImageProps } from "next/image";
import { resolveImageSrc } from "@/lib/image-url";

interface NewsImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

export function NewsImage({ src, quality = 90, ...props }: NewsImageProps) {
  const resolved = resolveImageSrc(src) ?? src;
  const proxied = resolved.startsWith("/api/media");

  return (
    <Image
      src={resolved}
      quality={quality}
      unoptimized={proxied}
      {...props}
    />
  );
}
