import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { MoodCatClient } from "./mood-cat-client"

export type MoodCat = {
  id: number
  image: string
  caption: string
  captionVi?: string
  attribution?: string
  attributionNote?: string
  attributionNoteVi?: string
}

export const moodCats: MoodCat[] = [
  {
    id: 1,
    image: "/coding-cat.png",
    caption: "meowtivated",
    captionVi: "đang meo-tivated hết cỡ",
    attribution: "https://www.reddit.com/r/aww/comments/s3t3mo/coding_cat_is_raising_your_productivity_3/",
  },
  {
    id: 2,
    image: "/bewildered-kitty.png",
    caption: "overthinking like my hooman",
    captionVi: "suy nghĩ nhiều như sen nhà luôn á",
    attribution: "https://www.reddit.com/r/aww/comments/1c841o3/my_friend_says_my_cat_has_resting_bewildered_face/",
  },
  {
    id: 3,
    image: "/keyboard-nap.png",
    caption: "404 nap not found",
    captionVi: "lỗi 404: không tìm thấy giấc ngủ trưa",
    attribution: "https://www.reddit.com/r/aww/comments/jdbrgp/how_am_i_supposed_to_game_with_this_tiny_kitten/",
  },
  {
    id: 4,
    image: "/contemplative-cat-coffee.png",
    caption: "catffeinated",
    captionVi: "đã nạp đủ cà-meo-in",
    attribution: "https://x.com/poorlycatdraw/status/1563137689326858240",
    attributionNote:
      'Original tweet: "RT @rolyat_taylor: thank you @poorlycatdraw cats. 💕 i call this: contemplating poor decisions during my morning cup of joe."',
    attributionNoteVi:
      'Tweet gốc: "RT @rolyat_taylor: thank you @poorlycatdraw cats. 💕 i call this: contemplating poor decisions during my morning cup of joe."',
  },
  {
    id: 5,
    image: "/erudite-feline.png",
    caption: "studying the meowconomy",
    captionVi: "đang nghiên cứu meo tế học",
    attribution: "https://www.reddit.com/r/CPA/comments/xwi18u/compilation_of_my_cat_studying_with_me",
  },
  {
    id: 6,
    image: "/academic-cat.png",
    caption: "purrfessor with tenure",
    captionVi: "giáo sư meomeo có biên chế hẳn hoi nha",
    attribution:
      "https://www.reddit.com/r/Catswithjobs/comments/vv5imm/officially_a_cat_of_science_with_an_additional/",
  },
  {
    id: 7,
    image: "/date-night-cat.png",
    caption: "waiting for my date to return from the bathroom",
    captionVi: "đang đợi bồ đi vệ sinh xong quay lại",
    attribution: "https://www.reddit.com/r/notinteresting/comments/1jxeskh/my_friend_went_on_a_date/",
  },
  {
    id: 8,
    image: "/barista-cat.png",
    caption: "your latte will be ready in a meowment",
    captionVi: "latte của bạn sẽ sẵn sàng trong vòng... một meo-ment",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/1jw0fvn/the_barista_will_prepare_your_latte_now/",
  },
  {
    id: 9,
    image: "/security-cat.png",
    caption: "pawsport and ID please",
    captionVi: "cho xin pawsport và căn cước nha",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/dncwls/the_security_guy_in_istanbul_turkey/",
  },
  {
    id: 10,
    image: "/retail-cat.png",
    caption: "i don't get paid enough for this",
    captionVi: "lương không đủ để chịu đựng mấy cái này đâu á",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/uopwrf/employee_of_the_month/",
  },
  {
    id: 11,
    image: "/singing-cat.png",
    caption: "hitting those high meowtes",
    captionVi: "lên tới nốt meow cao luôn rồi",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/1fqw9f3/tenor/",
  },
  {
    id: 12,
    image: "/postal-cat.png",
    caption: "US purrstal service, i have a purrcel for you",
    captionVi: "tui là dịch vụ bưu điện việt meo, tui có gói hàng meo cho bạn nè",
    attribution:
      "https://www.reddit.com/r/Catswithjobs/comments/10va12b/maam_us_purrstal_service_i_have_a_purrcel_for_you/",
  },
  {
    id: 13,
    image: "/pest-control-cat.png",
    caption: "rodents don't have a chance",
    captionVi: "lũ gặm nhấm không có cửa đâu",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/tsxus1/the_rodents_dont_have_a_chance/",
  },
  {
    id: 14,
    image: "/mechanic-cat.png",
    caption: "your purroblem is the catalytic converter",
    captionVi: "vấn đề là ở cái bộ chuyển xúc tác mèo đó",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/11kkwce/shambo_tryna_diagnose_my_car_not_sure_hes/",
  },
  {
    id: 15,
    image: "/ceo-cat.png",
    caption: "excavation supurrvisor, no breaks until the purrmit is approved",
    captionVi: "giám sát công trình meo meo đây, chưa có purrmit thì đừng hòng nghỉ trưa nhé",
    attribution: "https://www.reddit.com/r/Catswithjobs/comments/1iao56u/the_ceo_himself/",
  },
]

/**
 * Get a random cat from the list
 */
function getRandomCat(): MoodCat {
  return moodCats[Math.floor(Math.random() * moodCats.length)]
}

/**
 * Server component that renders a mood cat with progressive enhancement
 */
export function MoodCat() {
  // Pick a random cat on the server
  const initialCat = getRandomCat()

  return (
    <div className="relative">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold relative inline-block group">
          Cat of the day
          <span className="absolute left-0 -bottom-1 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          <noscript>
            <style>{`
              .mood-cat-hover-text { display: none; }
            `}</style>
          </noscript>
          <span className="mood-cat-hover-text absolute left-0 -top-6 w-full text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            judging you softly
          </span>
        </h2>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-muted" data-server-cat>
        <div className="relative aspect-[4/3] w-full">
          <div className="relative h-full w-full">
            <Image
              src={initialCat.image}
              alt={`Mood cat: ${initialCat.caption}`}
              fill
              className="object-cover"
              loading="lazy"
              priority={false}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xl font-medium text-center">
                {initialCat.caption}
              </p>
              {initialCat.attribution && (
                <p className="text-white/70 text-xs text-center mt-1">
                  <a
                    href={initialCat.attribution}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/90 transition-colors"
                    title={initialCat.attributionNote}
                  >
                    Image source
                  </a>
                  {initialCat.attributionNote && (
                    <span className="block mt-0.5 text-[10px] opacity-70">
                      {initialCat.attributionNote}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3" data-server-buttons>
        <Button variant="outline" size="sm" asChild className="group">
          <a href="https://www.reddit.com/r/Catswithjobs/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4 group-hover:animate-pulse" aria-hidden="true" />
            <span>See more cats</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </Button>
      </div>

      {/* Progressive enhancement - add client interactivity */}
      <MoodCatClient initialCat={initialCat} />
    </div>
  )
}
