import rehabilitationCenter from '../assets/demo-thumbnails/rehabilitation-center.jpg?inline';
import rehabilitationDesign from '../assets/demo-thumbnails/rehabilitation-design.jpg?inline';

export const demoThumbnails: Readonly<Record<string, { source: string; path: string }>> = {
  'https://mw-searchstax.github.io/university-health-search-demo/locations/rehabilitation-center/': {
    source: rehabilitationCenter,
    path: 'thumbnails/rehabilitation-center.jpg',
  },
  'https://mw-searchstax.github.io/university-health-search-demo/care/services/rehabilitation/': {
    source: rehabilitationDesign,
    path: 'thumbnails/rehabilitation-design.jpg',
  },
};
