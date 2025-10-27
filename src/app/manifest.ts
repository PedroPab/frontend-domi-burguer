// app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Domi Burguer - ¡Pídela ya!',
    short_name: 'Domi Burguer',
    lang: 'es',
    categories: ['food', 'lifestyle', 'shopping'],
    launch_handler: { client_mode: ['focus-existing', 'auto'] },
    description:
      '¡Haz tu pedido de hamburguesas artesanales! Creamos nuestro propio sabor con ingredientes frescos y recetas familiares.',
    orientation: 'portrait-primary',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e73533',
    icons: [
      { src: '/LogoMobile.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: '/LogoMobile.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: '/LogoMobile.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
      { src: '/LogoDesktop.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/LogoDesktop.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
      { src: '/LogoDesktop.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/LogoDesktop.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
      { src: '/LogoDesktop.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    shortcuts: [
      {
        name: 'Hacer Pedido',
        short_name: 'Pedir',
        description: 'Haz tu pedido en Domi Burguer de manera rápida',
        url: '/#products',
        icons: [{ src: '/LogoMobile.png', sizes: '96x96', type: 'image/png' }],
      },
      {
        name: 'Ver Carrito',
        short_name: 'Carrito',
        description: 'Revisa tu carrito de compras',
        url: '/cart',
        icons: [{ src: '/LogoMobile.png', sizes: '96x96', type: 'image/png' }],
      },
    ],
  };
}
