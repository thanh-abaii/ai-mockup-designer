
# AI Mockup Designer

This application allows users to upload an image (like a logo or graphic) and generate realistic mockups of it in various real-world settings. It leverages multiple calls to the Google Gemini API to create a context-aware and creatively directed final image.

## Features

- **Image Upload:** Users can upload their own graphics in PNG, JPG, or WEBP format.
- **Scene Selection:** Choose from a variety of pre-defined scenes like bus stops, urban walls, and laptop screens.
- **Slogan Integration:** Optionally add a text slogan to be incorporated into the mockup.
- **Aspect Ratio Control:** Select from common aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4) to control the final image dimensions.
- **AI-Powered Creativity:** The app doesn't just place the image; it analyzes it and brainstorms a unique, detailed prompt for a more cohesive and professional result.
- **Downloadable Results:** The final generated mockup can be downloaded as a PNG file.

---

## Generation Workflow

The application follows a sophisticated multi-step process to ensure high-quality results and correctly handle user-defined aspect ratios.

### 1. User Input & Client-Side Pre-processing

1.  **Gather Inputs:** The user uploads an image, optionally adds a slogan, and selects a scene and an aspect ratio.

2.  **Client-Side Image Padding (`utils/imageUtils.ts`):**
    - Before any API calls are made, the application processes the uploaded image directly in the browser.
    - It creates a new, larger canvas with a transparent background that perfectly matches the user's selected aspect ratio (e.g., 16:9).
    - The user's original image is placed, unaltered, in the center of this new transparent canvas.
    - **Result:** A new base64 image string of a correctly-proportioned image, ready for the AI. This client-side step is the key to solving the aspect ratio problem reliably.

### 2. AI Creative Process (`services/geminiService.ts`)

The application then orchestrates a series of calls to the Gemini API, acting as an AI-powered creative director.

3.  **Step 1: Image Analysis (`describeImage`):**
    - The **original user image** is sent to the `gemini-2.5-flash` model.
    - The model is prompted to return a concise, text-only description of the image, focusing on its subject, style, and colors (e.g., "A minimalist geometric logo with blue and orange triangles.").

4.  **Step 2: Creative Prompt Generation (`generateCreativePrompt`):**
    - The text description from the previous step is combined with the selected scene's prompt and the user's slogan.
    - This combined information is sent to the `gemini-2.5-flash` model, which is instructed to act as a "creative director."
    - It generates a new, detailed, and photorealistic prompt that creatively merges all the elements. This becomes the master instruction for the final generation step.

### 3. Final Mockup Generation (`services/geminiService.ts`)

5.  **Step 3: Image Editing & Scene Creation (`generateMockup`):**
    - The **padded image** (created in step 2) is sent to the `gemini-2.5-flash-image-preview` model.
    - The **creative prompt** (generated in step 4) is sent along with the image.
    - The AI's task is to "fill in" the transparent areas of the padded image according to the detailed instructions in the creative prompt, seamlessly integrating the central graphic into the new scene.
    - Because the input image already has the correct dimensions, the model's output reliably maintains the desired aspect ratio.

### 4. Displaying the Result

6.  **Render Output:** The final image received from the API is displayed to the user.
7.  **Show Prompt:** The creative prompt used for the generation is shown below the image for transparency.
8.  **Download:** The user can download the final high-quality mockup.
