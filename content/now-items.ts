import { BookOpen, Code, Coffee, Headphones, Brain, GraduationCap, Lightbulb } from "lucide-react"

export type NowItemContent = {
  en: string
  vi: string
  ru: string
  et: string
  da: string
  tr: string
  zh: string
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
    },
    date: "2025-09-16T21:32:18+07:00",
  },
  {
    id: 2,
    category: "coding",
    icon: Code,
    content: {
      en: "Improving this website to rely less on React and returning to static HTML",
      vi: "Đang cải thiện trang web này để giảm sự phụ thuộc vào React và quay về dùng HTML tĩnh",
      ru: "Улучшение этого сайта с меньшей зависимостью от React и возвращение к статическому HTML",
      et: "Selle veebisaidi täiustamine, et see sõltuks vähem Reactist ja naasmine staatilise HTML-i juurde",
      da: "Forbedring af dette websted for at være mindre afhængig af React og vende tilbage til statisk HTML",
      tr: "Bu web sitesini React'e daha az bağımlı hale getirmek ve statik HTML'e dönmek için iyileştiriyorum",
      zh: "改进此网站以减少对React的依赖，回归静态HTML",
    },
    date: "2025-09-17T14:30:17+07:00",
  },
  {
    id: 3,
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
    },
    date: "2025-09-15T16:45:20+07:00",
  },
  {
    id: 4,
    category: "listening",
    icon: Headphones,
    content: {
      en: '"Ramune" by Aqu3ra',
      vi: '"Ramune" của Aqu3ra',
      ru: '"Ramune" от Aqu3ra',
      et: '"Ramune" Aqu3ra poolt',
      da: '"Ramune" af Aqu3ra',
      tr: 'Aqu3ra\'dan "Ramune"',
      zh: 'Aqu3ra的《Ramune》'
    },
    date: "2025-09-16T21:41:25+07:00",
  },
  {
    id: 5,
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
    },
    date: "2025-09-16T22:30:00+07:00",
  },
  {
    id: 6,
    category: "studying",
    icon: GraduationCap,
    content: {
      en: "Geoeconomics and its effects on Vietnam's Vision 2035",
      vi: "Địa kinh tế và ảnh hưởng của nó đến Tầm nhìn 2035 của Việt Nam",
      ru: "Геоэкономика и ее влияние на Видение Вьетнама 2035 года",
      et: "Geoekonoomika ja selle mõju Vietnami visioonile 2035",
      da: "Geoekonomi og dens virkninger på Vietnams Vision 2035",
      tr: "Jeoekonomi ve bunun Vietnam'ın 2035 Vizyonu üzerindeki etkileri",
      zh: "地缘经济学及其对越南2035年愿景的影响"
    },
    date: "2025-09-16T11:15:11+07:00",
  },
  {
    id: 7,
    category: "planning",
    icon: Lightbulb,
    content: {
      en: "A research project on geoeconomics and how Vietnam leverages it for economic diplomacy in 2025",
      vi: "Một dự án nghiên cứu về địa kinh tế và cách Việt Nam tận dụng nó cho ngoại giao kinh tế trong năm 2025",
      ru: "Исследовательский проект по геоэкономике и тому, как Вьетнам использует ее для экономической дипломатии в 2025 году",
      et: "Uurimisprojekt geoekonoomika kohta ja kuidas Vietnam seda majandusdiplomaatias 2025. aastal kasutab",
      da: "Et forskningsprojekt om geoekonomi og hvordan Vietnam udnytter det til økonomisk diplomati i 2025",
      tr: "Jeoekonomi üzerine bir araştırma projesi ve Vietnam'ın bunu 2025'te ekonomik diplomasi için nasıl kullandığı",
      zh: "关于地缘经济学的研究项目，以及越南如何在2025年利用地缘经济学进行经济外交"
    },
    date: "2025-09-16T11:30:00+07:00",
  },
]
