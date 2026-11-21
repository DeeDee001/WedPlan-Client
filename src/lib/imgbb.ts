/**
 * Utility to upload images to ImgBB (Image Hosting)
 */
export const uploadToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_IMGBB_API_KEY is not defined in environment variables. Generating local data URL preview.');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success && result.data?.url) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || 'Failed to upload image to ImgBB');
    }
  } catch (error: any) {
    console.error('ImgBB upload error:', error);
    // Fallback to local data URL on network/API failure
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};
