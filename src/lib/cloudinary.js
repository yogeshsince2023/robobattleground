// ponytail: robust Cloudinary URL builder helpers that fallback to raw URLs if full paths are passed

export const buildLogoUrl = (publicId) => {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "rshcmlou";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:good,h_240,c_pad,b_transparent,e_trim/${publicId}`;
};

export const buildImageUrl = (publicId, transforms = "") => {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "rshcmlou";
  const t = transforms || "f_auto,q_auto:good,w_800";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${publicId}`;
};
