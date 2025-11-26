import { BookOpen, Code, Coffee, Headphones, Brain, GraduationCap, Lightbulb, Activity } from "lucide-react"

export type NowItemContent = {
  en: string
  vi: string
  ru: string
  et: string
  da: string
  tr: string
  zh: string
  pl: string
  sv: string
  fi: string
  tok: string
  vih: string
}

export type NowItem = {
  id: number
  category: string
  icon: any
  content: NowItemContent
  date: string
}

export const nowItems: NowItem[] = [
  {
    id: 1,
    category: "listening",
    icon: Headphones,
    content: {
      en: '"Ramune" by Aqu3ra',
      vi: '"Ramune" của Aqu3ra',
      ru: '"Ramune" от Aqu3ra',
      et: '"Ramune" Aqu3ra poolt',
      da: '"Ramune" af Aqu3ra',
      tr: 'Aqu3ra\'dan "Ramune"',
      zh: 'Aqu3ra的《Ramune》',
      pl: '"Ramune" autorstwa Aqu3ra',
      fi: 'Aqu3ran "Ramune"',
      sv: '"Ramune" av Aqu3ra',
      tok: '"Ramune" by Aqu3ra',
      vih: '「Ramune」𧵑 Aqu3ra'
    },
    date: "2025-11-16T21:41:25+07:00",
  },
  {
    id: 2,
    category: "premid",
    icon: Activity,
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
      sv: "Ingen nylig Discord-aktivitet"
    },
    date: "2025-11-26T00:00:00+07:00",
  },
  {
    id: 3,
    category: "planning",
    icon: Lightbulb,
    content: {
      en: "A research project on geoeconomics and how Vietnam leverages information sovereignty and cybersecurity as geoeconomic leverage in Vietnam’s datacenter development race",
      vi: "Một dự án nghiên cứu về địa kinh tế và cách Việt Nam tận dụng chủ quyền thông tin và an ninh mạng như một đòn bẩy địa kinh tế trong cuộc đua phát triển trung tâm dữ liệu",
      ru: "Исследовательский проект по геоэкономике и тому, как Вьетнам использует информационный суверенитет и кибербезопасность в качестве геоэкономического рычага в гонке за развитие центров обработки данных",
      et: "Uurimisprojekt geopoliitika kohta ja sellest, kuidas Vietnam kasutab infosuvereniteeti ning küberturvalisust geopoltilise eelise saavutamiseks andmekeskuste arendamise võidujooksus",
      da: "Et forskningsprojekt om geoøkonomi, og hvordan Vietnam udnytter informationssuverænitet og cybersikkerhed som en geoøkonomisk løftestang i kapløbet om at udvikle datacentre.",
      tr: "Jeoekonomi üzerine bir araştırma projesi ve Vietnam'ın veri merkezi geliştirme yarışında bilgi egemenliğini ve siber güvenliği jeoekonomik bir kaldıraç olarak nasıl kullandığı",
      zh: "关于地缘经济学的研究项目，以及越南如何利用信息主权和网络安全作为越南数据中心发展竞赛中的地缘经济杠杆",
      pl: "Projekt badawczy dotyczący geogospodarki i tego, jak Wietnam wykorzystuje suwerenność informacyjną i cyberbezpieczeństwo jako dźwignię geogospodarczą w wyścigu o rozwój centrów danych",
      fi: "Tutkimusprojekti geoekonomiasta ja siitä, miten Vietnam hyödyntää tietosuvereniteettia ja kyberturvallisuutta geoekonomisena vipuna Vietnamin datakeskusten kehityskilpailussa",
      sv: "Ett forskningsprojekt om geoekonomi och hur Vietnam utnyttjar informationssuveränitet och cybersäkerhet som geoekonomisk hävstång i Vietnams datacenterutvecklingskapplöpning",
    },
    date: "2025-11-26T10:36:00+07:00",
  },
  {
    id: 4,
    category: "reading",
    icon: BookOpen,
    content: {
      en: '"Joey Pigza Loses Control" by Jack Gantos',
      vi: '"Joey Pigza Loses Control" (Joey Pigza bị mất kiểm soát) của Jack Gantos',
      ru: '"Joey Pigza Loses Control" (Джоей Пигза теряет контроль) от Джек Гантос',
      et: '"Joey Pigza Loses Control" (Joey Pigza kaotab kontrolli) Jack Gantoselt',
      da: '"Joey Pigza Loses Control" (Joey Pigza mister kontrollen) af Jack Gantos',
      tr: 'Jack Gantos\'un "Joey Pigza Loses Control" (Joey Pigza Kontrolü Kaybediyor)',
      zh: '杰克·甘托斯（Jack Gantos）的《乔伊·皮格扎失控》（Joey Pigza Loses Control）',
      pl: '"Joey Pigza Loses Control" autorstwa Jacka Gantosa',
      sv: '"Joey Pigza Loses Control" av Jack Gantos',
      fi: 'Jack Gantosin "Joey Pigza Loses Control"',
      tok: '"Joey Pigza Loses Control" by Jack Gantos',
      vih: '「Joey Pigza Loses Control」（Joey Pigza 被𠅒檢詧）𧵑 Jack Gantos',
    },
    date: "2025-11-25T21:32:18+07:00",
  },
  {
    id: 5,
    category: "coding",
    icon: Code,
    content: {
      en: "Improving this website to rely less on React and returning to static HTML",
      vi: "Đang cải thiện trang web này để giảm sự phụ thuộc vào React và quay về sử dụng HTML tĩnh",
      ru: "Улучшение этого сайта с меньшей зависимостью от React и возвращение к статическому HTML",
      et: "Selle veebisaidi täiustamine, et see sõltuks vähem Reactist ja naasmine staatilise HTML-i juurde",
      da: "Forbedring af dette websted for at være mindre afhængig af React og vende tilbage til statisk HTML",
      tr: "Bu web sitesini React'e daha az bağımlı hale getirmek ve statik HTML'e dönmek için iyileştiriyorum",
      zh: "改进此网站以减少对React的依赖，回归静态HTML",
      pl: "Ulepszanie tej strony internetowej, aby mniej polegała na React i powrót do statycznego HTML",
      fi: "Tämän verkkosivuston parantaminen siten, että se riippuu vähemmän Reactista ja palaa staattiseen HTML:ään",
      sv: "Förbättra denna webbplats för att vara mindre beroende av React och återgå till statisk HTML",
      tok: "Improving this website to rely less on React and returning to static HTML",
      vih: "當改善張䇼尼抵減事附屬𠓨 React 吧𢮿𧗱使用 HTML 靜",
    },
    date: "2025-11-26T09:30:18+07:00",
  },
  {
    id: 6,
    category: "drinking",
    icon: Coffee,
    content: {
      en: "Some black sugar bubble tea from Mixue",
      vi: "Trà sữa trân châu đường đen của Mixue",
      ru: "Черный сахарный чай с пузырьками из Mixue",
      et: "Natuke musta suhkruga mulliteed Mixue'st",
      da: "Sort sukker boble te fra Mixue",
      tr: "Mixue'den biraz siyah şekerli baloncuklu çay",
      zh: "来自蜜雪的一些黑糖珍珠奶茶",
      pl: "Czarna herbata bąbelkowa z cukrem z Mixue",
      fi: "Mustaa sokerikuplateetä Mixuesta",
      sv: "Lite svart socker bubbelte från Mixue",
      tok: "Some black sugar bubble tea from Mixue",
      vih: "茶𣷱珍珠糖黰𧵑 Mixue",
    },
    date: "2025-11-23T16:45:20+07:00",
  },
  {
    id: 7,
    category: "thinking",
    icon: Brain,
    content: {
      en: "About how I can further improve myself and do the things I love more often",
      vi: "Về cách mình có thể cải thiện bản thân hơn nữa và làm những điều mình thích thường xuyên hơn",
      ru: "О том, как я могу дальше улучшать себя и чаще заниматься любимыми делами",
      et: "Sel teemal, kuidas ma saan ennast veelgi parandada ja teha asju, mida ma armastan, sagedamini",
      da: "Om, hvordan jeg yderligere kan forbedre mig selv og gøre de ting, jeg elsker, oftere",
      tr: "Kendimi nasıl daha da geliştirebileceğim ve sevdiğim şeyleri daha sık yapabileceğim hakkında",
      zh: "关于我如何进一步提升自己并更频繁地做我喜欢的事情",
      pl: "O tym, jak mogę dalej się rozwijać i częściej robić rzeczy, które kocham",
      fi: "Siitä, miten voin edelleen parantaa itseäni ja tehdä rakastamiani asioita useammin",
      sv: "Om hur jag kan förbättra mig själv ytterligare och göra de saker jag älskar oftare",
      tok: "About how I can further improve myself and do the things I love more often",
      vih: "𧗱格𨉟固体改善本身欣𡛤吧𫜵仍條𨉟適常川欣",
    },
    date: "2025-11-23T22:30:00+07:00",
  },
  {
    id: 8,
    category: "studying",
    icon: GraduationCap,
    content: {
      en: "Geoeconomics and its effects on Vietnam's Vision 2035",
      vi: "Địa kinh tế và ảnh hưởng của nó đến Tầm nhìn 2035 của Việt Nam",
      ru: "Геоэкономика и ее влияние на Видение Вьетнама 2035 года",
      et: "Geoekonoomika ja selle mõju Vietnami visioonile 2035",
      da: "Geoekonomi og dens virkninger på Vietnams Vision 2035",
      tr: "Jeoekonomi ve bunun Vietnam'ın 2035 Vizyonu üzerindeki etkileri",
      zh: "地缘经济学及其对越南2035年愿景的影响",
      pl: "Geoekonomia i jej wpływ na Wizję Wietnamu 2035",
      fi: "Geoekonomia ja sen vaikutukset Vietnamin Vision 2035:een",
      sv: "Geoekonomi och dess effekter på Vietnams Vision 2035",
      tok: "Geoeconomics and its effects on Vietnam's Vision 2035",
      vih: "地經濟吧影響𧵑伮𦤾尋𥆾 2035 𧵑越南",
    },
    date: "2025-11-26T09:36:11+07:00",
  },
]
