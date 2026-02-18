// Now items with multilingual support
export type NowItemContent = Record<'en' | 'vi' | 'ru' | 'et' | 'da' | 'tr' | 'zh' | 'pl' | 'sv' | 'fi' | 'tok' | 'vi-Hani', string>;

export type NowItemContentOptional = Partial<NowItemContent> & { en: string };

export type NowItem = {
  id: number;
  category: string;
  icon: string; // Icon name from lucide
  image?: string; // Optional image URL (e.g., cover art for listening)
  content: NowItemContent;
  contentSecondary?: NowItemContentOptional; // Optional second line (e.g., artist)
  date: string;
};

export const nowItems: NowItem[] = [
  {
    id: 1,
    category: "listening",
    icon: "Headphones",
    content: {
      en: 'Hanataba (Bouquet)',
      vi: 'Hanataba (Bó hoa)',
      ru: 'Hanataba (Букет)',
      et: 'Hanataba (Lillekimp)',
      da: 'Hanataba (Buket)',
      tr: 'Hanataba (Çiçek Demeti)',
      zh: '花束',
      pl: 'Hanataba (Bukiet)',
      sv: 'Hanataba (Bukett)',
      fi: 'Hanataba (Kukkakimppu)',
      tok: 'Hanataba (kulupu kasi kule)',
      'vi-Hani': '花束'
    },
    contentSecondary: {
      en: "HoneyComeBear"
    },
    image: "https://lastfm.freetls.fastly.net/i/u/174s/bf160d8ae5651e8f91fad2e7121bb8e2.jpg",
    date: "2026-02-09T20:33:36+00:00",
  },
  {
    id: 2,
    category: "premid",
    icon: "Activity",
    content: {
      en: "No recent Discord activity",
      vi: "Không có hoạt động trên Discord gần đây",
      ru: "Нет недавней активности в Discord",
      et: "Hiljutist Discord'i aktiivsust pole",
      da: "Ingen nylig Discord-aktivitet",
      tr: "Yakın zamanda Discord etkinliği yok",
      zh: "最近没有Discord活动",
      pl: "Brak ostatniej aktywności na Discordzie",
      fi: "Ei viimeaikaista Discord-toimintaa",
      sv: "Ingen nylig Discord-aktivitet",
      tok: "No recent Discord activity",
      'vi-Hani': "空固活動𨑗𨃗 Discord 𧕆低",
    },
    date: "2015-05-13T00:00:00-07:00",
  },
  {
    id: 3,
    category: "planning",
    icon: "Lightbulb",
    content: {
      en: "A research project on geoeconomics and how Vietnam leverages information sovereignty and cybersecurity as geoeconomic leverage in Vietnam's datacenter development race",
      vi: "Một dự án nghiên cứu về địa kinh tế và cách Việt Nam tận dụng chủ quyền thông tin và an ninh mạng làm đòn bẩy địa kinh tế trong cuộc đua phát triển trung tâm dữ liệu.",
      ru: "Исследовательский проект по геоэкономике и тому, как Вьетнам использует информационный суверенитет и кибербезопасность в качестве геоэкономического рычага в гонке развития дата-центров.",
      et: "Uurimisprojekt geomajandusest ja sellest, kuidas Vietnam kasutab infosuveräänsust ja küberturvalisust geomajandusliku hoovana oma andmekeskuste arendamise võidujooksus.",
      da: "Et forskningsprojekt om geoøkonomi, og hvordan Vietnam udnytter informationssuverænitet og cybersikkerhed som geoøkonomisk løftestang i Vietnams kapløb om udvikling af datacentre.",
      tr: "Jeoekonomi ve Vietnam'ın veri merkezi geliştirme yarışında bilgi egemenliğini ve siber güvenliği jeoekonomik bir kaldıraç olarak nasıl kullandığı üzerine bir araştırma projesi.",
      zh: "一项关于地缘经济学的研究项目，探讨越南如何在数据中心发展竞赛中利用信息主权和网络安全作为地缘经济杠杆。",
      pl: "Projekt badawczy dotyczący geoekonomii oraz tego, jak Wietnam wykorzystuje suwerenność informacyjną i cyberbezpieczeństwo jako dźwignię geoekonomiczną w wyścigu o rozwój centrów danych.",
      sv: "Ett forskningsprojekt om geoekonomi och hur Vietnam utnyttjar informationssuveränitet och cybersäkerhet som geoekonomiska hävstångar i landets kapplöpning om utveckling av datacenter.",
      fi: "Tutkimusprojekti geotaloudesta ja siitä, miten Vietnam hyödyntää tietosuvereniteettia ja kyberturvallisuutta geotaloudellisena vipuvartena maan datakeskusten kehityskilpailussa.",
      tok: "alasa sona pi mani ma, en nasin ni: ma Wije li kepeken lawa sona tawa wawa mani lon utala pi pali tomo ilo.",
      'vi-Hani': "𠬠預案研究𧗱地經濟吧格越南盡用主權通信吧安寧數𫜵杶㔥地經濟𥪝局𨅮發展中心與料",
    },
    date: "2025-12-30T15:05:05+07:00",
  },
  {
    id: 4,
    category: "reading",
    icon: "BookOpen",
    content: {
      en: '"Joey Pigza Loses Control" by Jack Gantos',
      vi: '"Joey Pigza Loses Control" (Joey Pigza bị mất kiểm soát) của Jack Gantos',
      ru: '"Joey Pigza Loses Control" (Джоуи Пигза теряет контроль) от Джека Гантоса',
      et: '"Joey Pigza Loses Control" (Joey Pigza kaotab kontrolli), autor Jack Gantos',
      da: '"Joey Pigza Loses Control" (Joey Pigza mister kontrollen) af Jack Gantos',
      tr: 'Jack Gantos\'tan "Joey Pigza Loses Control" (Joey Pigza Kontrolü Kaybediyor)',
      zh: '杰克·甘托斯 (Jack Gantos) 的《乔伊·皮格扎失控》(Joey Pigza Loses Control)',
      pl: '"Joey Pigza Loses Control" (Joey Pigza traci kontrolę) autorstwa Jacka Gantosa',
      fi: 'Jack Gantosin "Joey Pigza Loses Control" (Joey Pigza menettää hallinnan)',
      sv: '"Joey Pigza Loses Control" (Joey Pigza förlorar kontrollen) av Jack Gantos',
      tok: '"Joey Pigza Loses Control" tan jan Jack Gantos',
      'vi-Hani': '「Joey Pigza Loses Control」（Joey Pigza 被𠅒檢詧）𧕑 Jack Gantos',
    },
    date: "2026-02-15T21:32:18+07:00",
  },
  {
    id: 5,
    category: "coding",
    icon: "Code",
    content: {
      en: "Optimizing this website to rely less on React and migrate back to Astro",
      vi: "Tối ưu hóa trang web này để ít phụ thuộc vào React hơn và quay lại sử dụng Astro",
      ru: "Оптимизация сайта: снижаем зависимость от React и возвращаемся на Astro",
      et: "Veebisaidi täiustamine, et vähendada sõltuvust Reactist ja kolida tagasi Astrosse",
      da: "Forbedrer denne hjemmeside for at mindske afhængigheden af React og vender tilbage til Astro",
      tr: "React bağımlılığını azaltmak ve Astro'ya dönmek için site iyileştirmesi",
      zh: "改进此网站以减少对 React 的依赖并回归 Astro",
      pl: "Optymalizacja strony, zmniejszenie zależności od Reacta i powrót do Astro",
      sv: "Förbättrar webbplatsen för att minska beroendet av React och återgå till Astro",
      fi: "Sivuston parantaminen vähentämällä React-riippuvuutta ja palaamalla Astroon",
      tok: "mi pona e lipu ni. mi wile kepeken lili e ilo React. mi wile kepeken sin e ilo Astro",
      'vi-Hani': "最優化張䇼尼抵𠃣附屬𠓨 React 欣吧𢮿吏使用 Astro",
    },
    date: "2026-02-15T18:09:36+00:00",
  },
  {
    id: 6,
    category: "drinking",
    icon: "Coffee",
    content: {
      en: "Some refreshing water",
      vi: "Một chút nước mát lạnh",
      ru: "Немного освежающей воды",
      et: "Veidi värskendavat vett",
      da: "Lidt forfriskende vand",
      tr: "Biraz ferahlatıcı su",
      zh: "一些清爽的水",
      pl: "Trochę orzeźwiającej wody",
      sv: "Lite uppfriskande vatten",
      fi: "Hieman virkistävää vettä",
      tok: "telo lete pona",
      'vi-Hani': "𠬠𡭧渃𠖾冷",
    },
    date: "2026-02-14T06:10:18+00:00",
  },
  {
    id: 7,
    category: "thinking",
    icon: "Brain",
    content: {
      en: 'About how I can do the things I love more often',
      vi: 'Về cách mình có thể làm những điều mình yêu thích thường xuyên hơn',
      ru: 'О том, как я могу чаще заниматься тем, что люблю',
      et: 'Sellest, kuidas ma saaksin sagedamini teha asju, mida armastan',
      da: 'Om hvordan jeg kan gøre de ting, jeg elsker, oftere',
      tr: 'Sevdiğim şeyleri nasıl daha sık yapabileceğim hakkında',
      zh: '关于我怎样才能更经常地做我喜欢的事',
      pl: 'O tym, jak mogę częściej robić rzeczy, które kocham',
      fi: 'Siitä, kuinka voin tehdä rakastamiani asioita useammin',
      sv: 'Om hur jag kan göra de saker jag älskar oftare',
      tok: 'toki pi nasin ni: mi ken pali mute e ijo olin mi',
      'vi-Hani': "𧗱格𨉟固体𫜵仍條𨉟㤇適常川欣",
    },
    date: "2026-02-06T22:30:00+07:00",
  },
  {
    id: 8,
    category: "studying",
    icon: "GraduationCap",
    content: {
      en: 'International economics',
      vi: 'Kinh tế đối ngoại',
      ru: 'Международная экономика',
      et: 'Rahvusvaheline majandus',
      da: 'International økonomi',
      tr: 'Uluslararası ekonomi',
      zh: '国际经济学',
      pl: 'Ekonomia międzynarodowa',
      fi: 'Kansainvälinen talous',
      sv: 'Internationell ekonomi',
      tok: 'sona mani pi ma ale',
      'vi-Hani': "經濟對外",
    },
    date: "2026-01-06T11:18:08+07:00",
  },
];

// Helper to get localized content
export function getNowItemContent(item: NowItem, lang: string): string {
  return item.content[lang as keyof NowItemContent] || item.content.en;
}
