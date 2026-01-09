// Webring items
export type WebringItem = {
  name: string;
  url: string;
  previous: string;
  random: string | null;
  next: string;
  description?: string;
};

export const activeWebringItems: WebringItem[] = [
  {
    name: 'IndieWeb Webring 🕸💍',
    url: 'https://xn--sr8hvo.ws',
    previous: 'https://xn--sr8hvo.ws/previous',
    random: 'https://xn--sr8hvo.ws/random',
    next: 'https://xn--sr8hvo.ws/next',
    description: 'A webring for "folks adding IndieWeb building blocks to their personal websites to find other folks with IndieWeb building blocks on their sites!"',
  },
  {
    name: 'Hotline Webring',
    url: 'https://hotlinewebring.club/',
    previous: 'https://hotlinewebring.club/jar/previous',
    random: null,
    next: 'https://hotlinewebring.club/jar/next',
    description: '"Do you long for a simpler time, when America was Online and the only person you could Ask was Jeeves? Hotline Webring is bringing that time back!"',
  },
  {
    name: 'Meta Ring',
    url: 'https://meta-ring.hedy.dev/',
    previous: 'https://meta-ring.hedy.dev/previous',
    random: 'https://meta-ring.hedy.dev/random',
    next: 'https://meta-ring.hedy.dev/next',
    description: 'A webring for "personal website tinkerers; those with meta pages or colophons".',
  },
  {
    name: 'Bucket webring',
    url: 'https://webring.bucketfish.me',
    previous: 'https://webring.bucketfish.me/redirect.html?to=prev&name=Jarema',
    random: 'https://webring.bucketfish.me/redirect.html?to=random&name=Jarema',
    next: 'https://webring.bucketfish.me/redirect.html?to=next&name=Jarema',
    description: '"A webring for cool people who like to make things!"',
  },
  {
    name: 'The retronaut webring',
    url: 'https://webring.dinhe.net/',
    previous: 'https://webring.dinhe.net/prev/https://jarema.me',
    random: 'https://webring.dinhe.net/random',
    next: 'https://webring.dinhe.net/next/https://jarema.me',
    description: '"Some of us miss the messy old days of the Internet where we tried to get along and we\'d link to each other\'s sites and it was all so much fun."',
  },
  {
    name: '☆ Webmaster Webring ☆',
    url: 'https://webmasterwebring.netlify.app/',
    previous: 'https://webmasterwebring.netlify.app?jarema-previous',
    random: 'https://webmasterwebring.netlify.app?jarema-random',
    next: 'https://webmasterwebring.netlify.app?jarema-next',
    description: '"This is a webring for folks with websites, and for people who want to make their own!"',
  },
  {
    name: 'Fediring',
    url: 'https://fediring.net/',
    previous: 'https://fediring.net/previous?host=jarema.me',
    random: 'https://fediring.net/random',
    next: 'https://fediring.net/next?host=jarema.me',
    description: '"Personal sites of any member of the fediverse (also known as fedizens)."',
  },
  {
    name: 'Geekring',
    url: 'http://geekring.net/',
    previous: 'http://geekring.net/site/553/previous',
    random: 'http://geekring.net/site/553/random',
    next: 'http://geekring.net/site/553/next',
    description: '"This is a webring for geeks of all sorts, except those who feel excluded by the use of the word geek."',
  },
  {
    name: 'SSGRing',
    url: 'https://jbc.lol/webrings/ssgring/',
    previous: 'https://jbc.lol/webrings/ssgring/redirect?slug=jarema&way=prev',
    random: 'https://jbc.lol/webrings/ssgring/redirect?slug=jarema&way=rand',
    next: 'https://jbc.lol/webrings/ssgring/redirect?slug=jarema&way=next',
    description: '"Webring for sites that uses any Static Site Generation frameworks."',
  },
  {
    name: 'otoring webring',
    url: 'https://webring.otomir23.me/',
    previous: 'https://webring.otomir23.me/jarema/prev',
    random: 'https://webring.otomir23.me/jarema/random',
    next: 'https://webring.otomir23.me/jarema/next',
    description: 'This is otomir23\'s webring.',
  },
];

export const pendingWebringItems: WebringItem[] = [
  {
    name: 'Epic WebRing',
    url: 'https://epic1.nekoweb.org/webring/',
    previous: 'https://links.app.tc/noJS/?d=prev&url=https://jarema.me',
    random: 'https://links.app.tc/noJS/?d=rand&url=https://jarema.me',
    next: 'https://links.app.tc/noJS/?d=next&url=https://jarema.me',
    description: '"This webring is for anyone who is tired of how boring and same-y the internet is today."',
  },
  {
    name: 'NetLoop',
    url: 'https://netloop.netlify.app/',
    previous: 'https://netloop.netlify.app/jarema/previous',
    random: null,
    next: 'https://netloop.netlify.app/jarema/next',
    description: '"This is a webring!"',
  },
  {
    name: 'The Online webring',
    url: 'https://webring.ghostk.id/online/',
    previous: 'https://webring.ghostk.id/online/jarema/previous',
    random: 'https://webring.ghostk.id/online/random',
    next: 'https://webring.ghostk.id/online/jarema/next',
    description: 'A webring for "websites that are actively maintained and updated. No ghost towns here!"',
  },
];