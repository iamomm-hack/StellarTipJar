// Profile Management Storage Utilities

const PROFILE_STORAGE_KEY = "stellar_creator_profile";

export function saveProfile(profileData) {
  try {
    const profile = {
      name: profileData.name || "",
      bio: profileData.bio || "",
      profileImage: profileData.profileImage || null,
      customTips: profileData.customTips || [1, 5, 10],
      socialLinks: profileData.socialLinks || {},
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Error saving profile:", error);
    return false;
  }
}

export function getProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) {
      // Return default profile
      return {
        name: "OM KUMAR",
        bio: "",
        profileImage: null,
        customTips: [1, 5, 10],
        socialLinks: {},
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading profile:", error);
    return {
      name: "OM KUMAR",
      bio: "",
      profileImage: null,
      customTips: [1, 5, 10],
      socialLinks: {},
    };
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing profile:", error);
    return false;
  }
}

export function validateCustomTips(tips) {
  if (!Array.isArray(tips) || tips.length !== 3) {
    return false;
  }

  return tips.every((tip) => {
    const num = parseFloat(tip);
    return !isNaN(num) && num > 0 && num <= 10000;
  });
}

export function compressImage(file, maxWidth = 400, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
