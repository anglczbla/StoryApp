// src/utils/camera-handler.js
export async function useCamera(inputElementId) {
    const input = document.getElementById(inputElementId);
    input.setAttribute("accept", "image/*");
    input.setAttribute("capture", "environment");
  
    // Optional: preview
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (file) {
        const preview = document.createElement("img");
        preview.src = URL.createObjectURL(file);
        preview.alt = "Camera preview";
        preview.style.maxWidth = "200px";
        input.parentNode.appendChild(preview);
      }
    });
  }
  