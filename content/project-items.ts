export type ProjectContent = {
  en: {
    title: string
    description: string
    what: string
    learned: string
    why: string
  }
  vi: {
    title: string
    description: string
    what: string
    learned: string
    why: string
  }
  et: {
    title: string
    description: string
    what: string
    learned: string
    why: string
  }
  ru: {
    title: string
    description: string
    what: string
    learned: string
    why: string
  }
  da: {
    title: string
    description: string
    what: string
    learned: string
    why: string
  }
  tr: {
    title: string
    description: string
    what: string
    learned: string
    why: string
  }
}

export type Project = {
  id: number
  content: ProjectContent
  tags: string[]
  status: "completed" | "in-progress" | "planned"
  category: "personal" | "academic" | "activism"
  hidden?: boolean
}

export const projects: Project[] = [
  {
    id: 1,
    content: {
      en: {
        title: "Economics research paper",
        description: "Analysis of wealth inequality trends in post-industrial economies",
        what: "A comprehensive research paper examining wealth distribution patterns across developed nations",
        learned: "Advanced statistical modeling and comparative economic analysis",
        why: "To understand systemic factors driving inequality and propose policy solutions",
      },
      vi: {
        title: "Nghiên cứu kinh tế",
        description: "Phân tích xu hướng bất bình đẳng tài sản trong các nền kinh tế hậu công nghiệp",
        what: "Một bài nghiên cứu toàn diện về mô hình phân phối tài sản ở các quốc gia phát triển",
        learned: "Mô hình thống kê nâng cao và phân tích kinh tế so sánh",
        why: "Để hiểu các yếu tố hệ thống thúc đẩy bất bình đẳng và đề xuất giải pháp chính sách",
      },
      et: {
        title: "Majandusuuringute artikkel",
        description: "Varalise ebavõrdsuse trendide analüüs postindustriaalsetes majandustes",
        what: "Kõikehõlmav uurimisartikkel, mis käsitleb varade jaotuse mustreid arenenud riikides",
        learned: "Täpsem statistiline modelleerimine ja võrdlev majandusanalüüs",
        why: "Süsteemsete ebavõrdsust põhjustavate tegurite mõistmiseks ja poliitikalahenduste pakkumiseks",
      },
      ru: {
        title: "Экономическое исследование",
        description: "Анализ тенденций имущественного неравенства в постиндустриальных экономиках",
        what: "Комплексное исследование моделей распределения богатства в развитых странах",
        learned: "Продвинутое статистическое моделирование и сравнительный экономический анализ",
        why: "Понять системные факторы, способствующие неравенству, и предложить политические решения",
      },
      da: {
        title: "Økonomisk forskningspaper",
        description: "Analyse af formueuligheds tendenser i postindustrielle økonomier",
        what: "En omfattende forskningsartikel, der undersøger formuefordelingsmønstre på tværs af udviklede nationer",
        learned: "Avanceret statistisk modellering og komparativ økonomisk analyse",
        why: "At forstå systemiske faktorer, der driver ulighed, og foreslå politiske løsninger",
      },
      tr: {
        title: "Ekonomi araştırma makalesi",
        description: "Post-endüstriyel ekonomilerde servet eşitsizliği eğilimlerinin analizi",
        what: "Gelişmiş ülkelerde servet dağılımı modellerini inceleyen kapsamlı bir araştırma makalesi",
        learned: "Gelişmiş istatistiksel modelleme ve karşılaştırmalı ekonomik analiz",
        why: "Eşitsizliği tetikleyen sistemik faktörleri anlamak ve politika çözümleri önermek",
      },
    },
    tags: ["research", "economics", "data-analysis"],
    status: "completed",
    category: "academic",
  },
  {
    id: 2,
    content: {
      en: {
        title: "Multilingual chat app",
        description: "Real-time translation for cross-cultural conversations",
        what: "A chat application that translates messages in real-time between users speaking different languages",
        learned: "WebSocket implementation, translation APIs, and state management in complex applications",
        why: "To break down language barriers in online communication",
      },
      vi: {
        title: "Ứng dụng chat đa ngôn ngữ",
        description: "Dịch thời gian thực cho các cuộc trò chuyện liên văn hóa",
        what: "Một ứng dụng chat dịch tin nhắn theo thời gian thực giữa người dùng nói các ngôn ngữ khác nhau",
        learned: "Triển khai WebSocket, API dịch thuật và quản lý trạng thái trong ứng dụng phức tạp",
        why: "Để phá vỡ rào cản ngôn ngữ trong giao tiếp trực tuyến",
      },
      et: {
        title: "Mitmekeelne vestlusrakendus",
        description: "Reaalajas tõlge kultuuridevahelisteks vestlusteks",
        what: "Vestlusrakendus, mis tõlgib sõnumeid reaalajas erinevaid keeli rääkivate kasutajate vahel",
        learned: "WebSocketi rakendamine, tõlke API-d ja oleku haldamine keerukates rakendustes",
        why: "Keelebarjääride murdmiseks veebisuhtluses",
      },
      ru: {
        title: "Многоязычное чат-приложение",
        description: "Перевод в реальном времени для межкультурных бесед",
        what: "Чат-приложение, которое переводит сообщения в реальном времени между пользователями, говорящими на разных языках",
        learned: "Реализация WebSocket, API перевода и управление состоянием в сложных приложениях",
        why: "Преодолеть языковые барьеры в онлайн-общении",
      },
      da: {
        title: "Flersproget chat-app",
        description: "Realtidsoversættelse til tværkulturelle samtaler",
        what: "En chat-applikation, der oversætter beskeder i realtid mellem brugere, der taler forskellige sprog",
        learned: "WebSocket-implementering, oversættelses-API'er og tilstandsstyring i komplekse applikationer",
        why: "At nedbryde sprogbarrierer i online kommunikation",
      },
      tr: {
        title: "Çok dilli sohbet uygulaması",
        description: "Kültürlerarası konuşmalar için gerçek zamanlı çeviri",
        what: "Farklı diller konuşan kullanıcılar arasında mesajları gerçek zamanlı olarak çeviren bir sohbet uygulaması",
        learned: "WebSocket uygulaması, çeviri API'leri ve karmaşık uygulamalarda durum yönetimi",
        why: "Çevrimiçi iletişimde dil engellerini ortadan kaldırmak",
      },
    },
    tags: ["react", "node", "i18n", "websockets"],
    status: "in-progress",
    category: "personal",
  },
  {
    id: 3,
    content: {
      en: {
        title: "Climate action platform",
        description: "Connecting activists with local environmental initiatives",
        what: "A platform that maps local environmental projects and connects volunteers with initiatives",
        learned: "Geolocation APIs, community building features, and user engagement strategies",
        why: "To empower local communities to take meaningful climate action",
      },
      vi: {
        title: "Nền tảng hành động khí hậu",
        description: "Kết nối các nhà hoạt động với các sáng kiến môi trường địa phương",
        what: "Một nền tảng lập bản đồ các dự án môi trường địa phương và kết nối tình nguyện viên với các sáng kiến",
        learned: "API định vị địa lý, tính năng xây dựng cộng đồng và chiến lược thu hút người dùng",
        why: "Để trao quyền cho cộng đồng địa phương thực hiện hành động khí hậu có ý nghĩa",
      },
      et: {
        title: "Kliimatoimingute platvorm",
        description: "Ühendab aktiviste kohalike keskkonnaalgatustega",
        what: "Platvorm, mis kaardistab kohalikke keskkonnaprojekte ja ühendab vabatahtlikke algatustega",
        learned: "Geolokatsiooni API-d, kogukonna loomise funktsioonid ja kasutajate kaasamise strateegiad",
        why: "Anda kohalikele kogukondadele võimalus võtta tähenduslikke kliimatoiminguid",
      },
      ru: {
        title: "Платформа климатических действий",
        description: "Соединение активистов с местными экологическими инициативами",
        what: "Платформа, которая отображает местные экологические проекты и соединяет волонтеров с инициативами",
        learned: "API геолокации, функции построения сообщества и стратегии вовлечения пользователей",
        why: "Дать местным сообществам возможность предпринимать значимые действия по борьбе с изменением климата",
      },
      da: {
        title: "Klimahandlingsplatform",
        description: "Forbinder aktivister med lokale miljøinitiativer",
        what: "En platform, der kortlægger lokale miljøprojekter og forbinder frivillige med initiativer",
        learned: "Geolokations-API'er, fællesskabsopbyggende funktioner og brugerengagementsstrategier",
        why: "At give lokale samfund mulighed for at tage meningsfuld klimahandling",
      },
      tr: {
        title: "İklim eylemi platformu",
        description: "Aktivistleri yerel çevre girişimleriyle buluşturma",
        what: "Yerel çevre projelerini haritalayan ve gönüllüleri girişimlerle buluşturan bir platform",
        learned: "Coğrafi konum API'leri, topluluk oluşturma özellikleri ve kullanıcı katılım stratejileri",
        why: "Yerel toplulukları anlamlı iklim eylemi gerçekleştirmeleri için güçlendirmek",
      },
    },
    tags: ["activism", "community", "react", "maps-api"],
    status: "completed",
    category: "activism",
  },
  {
    id: 4,
    content: {
      en: {
        title: "Economic justice toolkit",
        description: "Resources for understanding and advocating for economic equality",
        what: "An educational resource hub with interactive tools explaining economic concepts and advocacy strategies",
        learned: "Creating accessible educational content and interactive data visualizations",
        why: "To make economic concepts more accessible and support grassroots economic justice movements",
      },
      vi: {
        title: "Bộ công cụ công bằng kinh tế",
        description: "Tài nguyên để hiểu và vận động cho bình đẳng kinh tế",
        what: "Một trung tâm tài nguyên giáo dục với các công cụ tương tác giải thích các khái niệm kinh tế và chiến lược vận động",
        learned: "Tạo nội dung giáo dục dễ tiếp cận và trực quan hóa dữ liệu tương tác",
        why: "Để làm cho các khái niệm kinh tế dễ tiếp cận hơn và hỗ trợ các phong trào công bằng kinh tế cơ sở",
      },
      et: {
        title: "Majandusliku õigluse tööriistakomplekt",
        description: "Ressursid majandusliku võrdõiguslikkuse mõistmiseks ja eestkoste tegemiseks",
        what: "Haridusressursside keskus interaktiivsete tööriistadega, mis selgitavad majanduslikke mõisteid ja eestkoste strateegiaid",
        learned: "Juurdepääsetava haridusliku sisu ja interaktiivsete andmete visualiseerimise loomine",
        why: "Et muuta majanduslikud mõisted paremini kättesaadavaks ja toetada rohujuure tasandi majandusliku õigluse liikumisi",
      },
      ru: {
        title: "Инструментарий экономической справедливости",
        description: "Ресурсы для понимания и защиты экономического равенства",
        what: "Образовательный ресурсный центр с интерактивными инструментами, объясняющими экономические концепции и стратегии защиты",
        learned: "Создание доступного образовательного контента и интерактивной визуализации данных",
        why: "Сделать экономические концепции более доступными и поддержать низовые движения за экономическую справедливость",
      },
      da: {
        title: "Værktøjssæt til økonomisk retfærdighed",
        description: "Ressourcer til at forstå og tale for økonomisk lighed",
        what: "Et uddannelsesressourcecenter med interaktive værktøjer, der forklarer økonomiske begreber og fortalerstrategier",
        learned: "Skabelse af tilgængeligt uddannelsesindhold og interaktive datavisualiseringer",
        why: "At gøre økonomiske begreber mere tilgængelige og støtte græsrodsbevægelser for økonomisk retfærdighed",
      },
      tr: {
        title: "Ekonomik adalet araç seti",
        description: "Ekonomik eşitliği anlamak ve savunmak için kaynaklar",
        what: "Ekonomik kavramları ve savunuculuk stratejilerini açıklayan interaktif araçlar içeren bir eğitim kaynağı merkezi",
        learned: "Erişilebilir eğitim içeriği ve interaktif veri görselleştirmeleri oluşturma",
        why: "Ekonomik kavramları daha erişilebilir hale getirmek ve tabandan ekonomik adalet hareketlerini desteklemek",
      },
    },
    tags: ["education", "activism", "economics"],
    status: "in-progress",
    category: "activism",
  },
  {
    id: 5,
    content: {
      en: {
        title: "Language learning game",
        description: "Gamified approach to learning vocabulary in multiple languages",
        what: "A game that teaches vocabulary through spaced repetition and contextual learning",
        learned: "Game design principles, educational psychology, and language acquisition theory",
        why: "To make language learning more engaging and effective",
      },
      vi: {
        title: "Trò chơi học ngôn ngữ",
        description: "Phương pháp gamification để học từ vựng trong nhiều ngôn ngữ",
        what: "Một trò chơi dạy từ vựng thông qua lặp lại theo khoảng thời gian và học tập theo ngữ cảnh",
        learned: "Nguyên tắc thiết kế trò chơi, tâm lý giáo dục và lý thuyết tiếp thu ngôn ngữ",
        why: "Để làm cho việc học ngôn ngữ hấp dẫn và hiệu quả hơn",
      },
      et: {
        title: "Keeleõppe mäng",
        description: "Mänguline lähenemine mitme keele sõnavara õppimisele",
        what: "Mäng, mis õpetab sõnavara hajutatud kordamise ja kontekstuaalse õppimise kaudu",
        learned: "Mängudisaini põhimõtted, hariduspsühholoogia ja keele omandamise teooria",
        why: "Et muuta keeleõpe kaasahaaravamaks ja tõhusamaks",
      },
      ru: {
        title: "Игра для изучения языков",
        description: "Игровой подход к изучению словарного запаса на нескольких языках",
        what: "Игра, которая обучает словарному запасу через интервальное повторение и контекстное обучение",
        learned: "Принципы дизайна игр, образовательная психология и теория усвоения языка",
        why: "Сделать изучение языка более увлекательным и эффективным",
      },
      da: {
        title: "Sprogindlæringsspil",
        description: "Gamificeret tilgang til at lære ordforråd på flere sprog",
        what: "Et spil, der underviser i ordforråd gennem fordelt gentagelse og kontekstuel læring",
        learned: "Principper for spildesign, uddannelsespsykologi og sprogindlæringsteori",
        why: "At gøre sprogindlæring mere engagerende og effektiv",
      },
      tr: {
        title: "Dil öğrenme oyunu",
        description: "Birden fazla dilde kelime öğrenmeye yönelik oyunlaştırılmış yaklaşım",
        what: "Aralıklı tekrar ve bağlamsal öğrenme yoluyla kelime öğreten bir oyun",
        learned: "Oyun tasarım ilkeleri, eğitim psikolojisi ve dil edinim teorisi",
        why: "Dil öğrenmeyi daha ilgi çekici ve etkili hale getirmek",
      },
    },
    tags: ["javascript", "linguistics", "education", "game"],
    status: "planned",
    category: "personal",
  },
  {
    id: 6,
    content: {
      en: {
        title: "Chaos theory visualization",
        description: "Interactive exploration of chaos theory principles",
        what: "An interactive web application visualizing chaos theory concepts like the butterfly effect",
        learned: "Advanced canvas manipulation, mathematical modeling, and interactive visualization techniques",
        why: "To make complex mathematical concepts more intuitive and accessible",
      },
      vi: {
        title: "Trực quan hóa lý thuyết hỗn loạn",
        description: "Khám phá tương tác các nguyên tắc của lý thuyết hỗn loạn",
        what: "Một ứng dụng web tương tác trực quan hóa các khái niệm lý thuyết hỗn loạn như hiệu ứng cánh bướm",
        learned: "Thao tác canvas nâng cao, mô hình hóa toán học và kỹ thuật trực quan hóa tương tác",
        why: "Để làm cho các khái niệm toán học phức tạp trở nên trực quan và dễ tiếp cận hơn",
      },
      et: {
        title: "Kaosteooria visualiseerimine",
        description: "Kaosteooria põhimõtete interaktiivne uurimine",
        what: "Interaktiivne veebirakendus, mis visualiseerib kaosteooria kontseptsioone, nagu liblikamõju",
        learned: "Täpsem canvas-manipulatsioon, matemaatiline modelleerimine ja interaktiivse visualiseerimise tehnikad",
        why: "Et muuta keerukad matemaatilised kontseptsioonid intuitiivsemaks ja paremini kättesaadavaks",
      },
      ru: {
        title: "Визуализация теории хаоса",
        description: "Интерактивное исследование принципов теории хаоса",
        what: "Интерактивное веб-приложение, визуализирующее концепции теории хаоса, такие как эффект бабочки",
        learned: "Продвинутые манипуляции с холстом, математическое моделирование и методы интерактивной визуализации",
        why: "Сделать сложные математические концепции более интуитивно понятными и доступными",
      },
      da: {
        title: "Visualisering af kaosteori",
        description: "Interaktiv udforskning af kaosteoriprincipper",
        what: "En interaktiv webapplikation, der visualiserer kaosteoribegreber som sommerfugleeffekten",
        learned: "Avanceret canvas-manipulation, matematisk modellering og interaktive visualiseringsteknikker",
        why: "At gøre komplekse matematiske begreber mere intuitive og tilgængelige",
      },
      tr: {
        title: "Kaos teorisi görselleştirmesi",
        description: "Kaos teorisi ilkelerinin interaktif keşfi",
        what: "Kelebek etkisi gibi kaos teorisi kavramlarını görselleştiren interaktif bir web uygulaması",
        learned: "Gelişmiş canvas manipülasyonu, matematiksel modelleme ve interaktif görselleştirme teknikleri",
        why: "Karmaşık matematiksel kavramları daha sezgisel ve erişilebilir hale getirmek",
      },
    },
    tags: ["mathematics", "visualization", "canvas"],
    status: "in-progress",
    category: "academic",
  },
  {
    id: 7,
    content: {
      en: {
        title: "Secret cat project",
        description: "Something mysterious involving cats...",
        what: "A highly experimental project exploring feline-inspired algorithms",
        learned: "Cutting-edge AI techniques and unconventional problem-solving approaches",
        why: "Because cats are the ultimate inspiration for chaos and creativity",
      },
      vi: {
        title: "Dự án mèo bí mật",
        description: "Điều gì đó bí ẩn liên quan đến mèo...",
        what: "Một dự án thử nghiệm cao cấp khám phá các thuật toán lấy cảm hứng từ mèo",
        learned: "Kỹ thuật AI tiên tiến và cách tiếp cận giải quyết vấn đề phi truyền thống",
        why: "Bởi vì mèo là nguồn cảm hứng tối thượng cho sự hỗn loạn và sáng tạo",
      },
      et: {
        title: "Salajane kassiprojekt",
        description: "Midagi salapärast, mis hõlmab kasse...",
        what: "Kõige eksperimentaalsem projekt, mis uurib kassidest inspireeritud algoritme",
        learned: "Tipptasemel tehisintellekti tehnikad ja ebatraditsioonilised probleemide lahendamise lähenemisviisid",
        why: "Sest kassid on kaose ja loovuse ülim inspiratsioon",
      },
      ru: {
        title: "Секретный кошачий проект",
        description: "Что-то таинственное, связанное с кошками...",
        what: "Высокоэкспериментальный проект, исследующий алгоритмы, вдохновленные кошками",
        learned: "Передовые методы ИИ и нетрадиционные подходы к решению проблем",
        why: "Потому что кошки — это главное ������дохновение для хаоса и творчества",
      },
      da: {
        title: "Hemmeligt katteprojekt",
        description: "Noget mystisk med katte...",
        what: "Et højst eksperimentelt projekt, der udforsker katteinspirerede algoritmer",
        learned: "Banebrydende AI-teknikker og ukonventionelle problemløsningstilgange",
        why: "Fordi katte er den ultimative inspiration for kaos og kreativitet",
      },
      tr: {
        title: "Gizli kedi projesi",
        description: "Kedilerle ilgili gizemli bir şey...",
        what: "Kedi ilhamlı algoritmaları keşfeden son derece deneysel bir proje",
        learned: "En son AI teknikleri ve alışılmadık problem çözme yaklaşımları",
        why: "Çünkü kediler kaos ve yaratıcılık için nihai ilham kaynağıdır",
      },
    },
    tags: ["experimental", "cats", "ai"],
    status: "planned",
    category: "personal",
    hidden: true,
  },
]
