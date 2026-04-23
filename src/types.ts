/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  genre: string;
  coverUrl: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Echoes',
    artist: 'AI Gen-01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    genre: 'Synthwave',
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'AI Gen-02',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    genre: 'Dark Techno',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'AI Gen-03',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 310,
    genre: 'Lofi Glitch',
    coverUrl: 'https://images.unsplash.com/photo-1633533452148-a9657d299ea1?q=80&w=300&h=300&auto=format&fit=crop'
  }
];
