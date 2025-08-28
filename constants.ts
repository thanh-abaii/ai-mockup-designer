import type { Scene } from './types';

export const SCENES: Scene[] = [
  { 
    id: 'bus_stop', 
    name: 'Bus Stop', 
    prompt: 'An advertising space at a modern, sleek bus stop shelter on a busy city street during a bright, sunny day, with potential for reflections on the glass.', 
    previewImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80&fit=crop' 
  },
  { 
    id: 'times_square', 
    name: 'Times Square', 
    prompt: 'A massive, glowing digital billboard in the center of Times Square at night. The scene is vibrant, surrounded by other bright advertisements and city lights.', 
    previewImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&q=80&fit=crop' 
  },
  { 
    id: 'urban_wall', 
    name: 'Urban Wall', 
    prompt: 'A high-quality, wheatpaste poster on a gritty, textured urban brick wall. There might be slight, realistic details like wrinkles or tears.', 
    previewImage: 'https://images.unsplash.com/photo-1715317441202-959636550250?w=400&q=80&fit=crop' 
  },
  { 
    id: 'metro_station', 
    name: 'Metro Station', 
    prompt: 'A backlit advertising frame on the wall of a clean, modern underground metro or subway station. The lighting is slightly moody and artificial.', 
    previewImage: 'https://images.unsplash.com/photo-1556695736-d287caebc48e?w=400&q=80&fit=crop' 
  },
  { 
    id: 'art_gallery', 
    name: 'Art Gallery', 
    prompt: 'A framed piece of art hanging on a clean, white wall in a minimalist art gallery, illuminated by gallery-style spotlights.', 
    previewImage: 'https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=400&q=80&fit=crop' 
  },
  {
    id: 'laptop_screen',
    name: 'Laptop Screen',
    prompt: 'The screen of a modern, silver laptop, which is placed on a wooden desk next to a coffee cup and a notebook.',
    previewImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&q=80&fit=crop'
  }
];

export const ASPECT_RATIOS: string[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
