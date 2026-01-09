// Now items with multilingual support
export type NowItemContent = {
  en: string;
  vi: string;
  ru: string;
  et: string;
  da: string;
  tr: string;
  zh: string;
  pl: string;
  sv: string;
  fi: string;
  tok: string;
  vih: string;
};

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
      vih: '花束'
    },
    contentSecondary: {
      en: "HoneyComeBear"
    },
    image: "https://lastfm.freetls.fastly.net/i/u/64s/bf160d8ae5651e8f91fad2e7121bb8e2.jpg",
    date: "2025-12-20T00:15:36+00:00",
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
      vih: "空固活動𨑗 Discord 𧵆低",
    },
    date: "2015-05-13T00:00:00+00:00",
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
      vih: "𠬠預案研究𧗱地經濟吧格越南盡用主權通信吧安寧數𫜵杶㔥地經濟𥪝局𨅮發展中心與料",
    },
    date: "2025-12-20T15:05:05+00:00",
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
      vih: '「Joey Pigza Loses Control」（Joey Pigza 被𠅒檢詧）𧵑 Jack Gantos',
    },
    date: "2025-12-12T21:32:18+07:00",
  },
  {
    id: 5,
    category: "coding",
    icon: "Code",
    content: {
      en: "Improving this website to rely less on React and returning to static HTML",
      vi: "Cải thiện trang web này để ít phụ thuộc vào React hơn và quay lại sử dụng HTML tĩnh",
      ru: "Улучшение этого веб-сайта для уменьшения зависимости от React и возврата к статическому HTML",
      et: "Selle veebisaidi täiustamine, et vähendada sõltuvust Reactist ja naasta staatilise HTML-i juurde",
      da: "Forbedring af denne hjemmeside for at være mindre afhængig af React og vende tilbage til statisk HTML",
      tr: "Bu web sitesini React'e daha az bağımlı hale getirmek ve statik HTML'e geri dönmek için iyileştirmek",
      zh: "改进此网站以减少对 React 的依赖并回归静态 HTML",
      pl: "Ulepszanie tej strony internetowej, aby w mniejszym stopniu polegała na React i powrót do statycznego HTML",
      sv: "Förbättra denna webbplats för att förlita sig mindre på React och återgå till statisk HTML",
      fi: "Tämän verkkosivuston parantaminen vähentämällä riippuvuutta Reactista ja palaamalla staattiseen HTML:ään",
      tok: "mi pona e lipu ni: mi wile weka e ilo React, mi wile kepeken nasin HTML taso",
      vih: "改善張䇼尼抵𠃣附屬𠓨 React 欣吧𢮿吏使用 HTML 靜",
    },
    date: "2025-12-20T17:09:36+00:00",
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
      vih: "𠬠𡭧渃𠖾冷",
    },
    date: "2025-12-19T00:10:18+00:00",
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
      vih: "𧗱格𨉟固体𫜵仍條𨉟㤇適常川欣",
    },
    date: "2025-12-18T22:30:00+07:00",
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
      vih: "經濟對外",
    },
    date: "2025-12-18T11:18:08+07:00",
  },
];

// Helper to get localized content
export function getNowItemContent(item: NowItem, lang: string): string {
  return item.content[lang as keyof NowItemContent] || item.content.en;
}
