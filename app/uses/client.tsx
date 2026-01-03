"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"
import {
  ImageIcon,
  Lock,
  EyeOff,
} from "lucide-react"
import { DarkModeFirefly } from "@/components/firefly"
import { useMounted } from "@/hooks"
import { CategoryHeader, ExternalLinkText } from "@/components/translated-text"
import { USES_ICONS, USES_STATIC_CATEGORIES } from "@/lib/icons"
import type { SerializableUsesCategory, SerializableUsesItem } from "./types"

interface UsesClientWrapperProps {
  categories: SerializableUsesCategory[]
}

// Icon map for rendering - use shared USES_ICONS
const iconMap = USES_ICONS

// Static category titles - use shared USES_STATIC_CATEGORIES
const staticCategoryTitles = USES_STATIC_CATEGORIES

function renderIcon(iconName: string, className: string = "h-6 w-6") {
  const IconComponent = iconMap[iconName]
  return IconComponent ? (
    <IconComponent className={className} />
  ) : (
    <ImageIcon className={className} />
  )
}

function UsesItem({
  item,
  descriptionText,
}: {
  item: SerializableUsesItem
  descriptionText?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary" />
      <div>
        <h3 className="text-xl font-medium">
          {item.link ? (
            <ExternalLinkText
              href={item.link}
              className="hover:text-primary inline-flex items-center"
              iconClassName="h-4 w-4 ml-1 opacity-70"
            >
              {item.name}
            </ExternalLinkText>
          ) : (
            item.name
          )}
        </h3>
        {(descriptionText || item.description) && (
          <p className="text-muted-foreground">
            {descriptionText || item.description}
          </p>
        )}
      </div>
    </div>
  )
}

function HiddenPlatformItem({
  platformId,
  clicks,
  onClick,
  revealedName,
  revealedDescriptionKey,
}: {
  platformId: "platform1" | "platform2"
  clicks: number
  onClick: () => void
  revealedName: string
  revealedDescriptionKey: string
}) {
  const { t } = useTranslation()
  const isRevealed = clicks >= 5

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary" />
      <div className="cursor-pointer group" onClick={onClick}>
        <h4 className="text-lg font-medium flex items-center">
          {isRevealed ? (
            <>
              {revealedName}
              <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />
            </>
          ) : (
            <>
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                {t(`uses.hiddenPlatforms.${platformId}`)}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({5 - clicks} {t("uses.itemDescriptions.clicksRemaining")})
              </span>
            </>
          )}
        </h4>
        <p className="text-muted-foreground">
          {isRevealed
            ? t(`uses.itemDescriptions.${revealedDescriptionKey}`)
            : t("uses.hiddenPlatforms.click5")}
        </p>
      </div>
    </div>
  )
}

export default function UsesClientWrapper({
  categories,
}: UsesClientWrapperProps) {
  const { t } = useTranslation()
  const mounted = useMounted()
  const [revancedClicks, setRevancedClicks] = useState(0)
  const [stremioClicks, setStremioClicks] = useState(0)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleRevancedClick = useCallback(() => {
    setRevancedClicks((prev) => prev + 1)
  }, [])

  const handleStremioClick = useCallback(() => {
    setStremioClicks((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (mounted) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement &&
            document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        let categoryIndex = -1
        if (e.key >= "1" && e.key <= "9") {
          categoryIndex = Number.parseInt(e.key) - 1
        } else if (e.key === "0") {
          categoryIndex = 9
        } else if (e.key === "-") {
          categoryIndex = 10
        }

        if (categoryIndex >= 0 && categoryIndex < categoryRefs.current.length) {
          e.preventDefault()

          if (categoryRefs.current[categoryIndex]) {
            categoryRefs.current[categoryIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            const categoryElement = categoryRefs.current[categoryIndex]
            if (categoryElement) {
              categoryElement.classList.add(
                "ring-2",
                "ring-primary",
                "ring-offset-2"
              )
              setTimeout(() => {
                categoryElement.classList.remove(
                  "ring-2",
                  "ring-primary",
                  "ring-offset-2"
                )
              }, 1000)

              const categoryTitle =
                categoryElement.querySelector("h2")?.textContent
              const announcement = document.getElementById(
                "keyboard-announcement"
              )
              if (announcement && categoryTitle) {
                announcement.textContent = `Jumped to ${categoryTitle}`
              }
            }
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mounted])

  // Static content for no-JS users
  if (!mounted) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                Uses
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                All the things I use on a daily basis. Also available on{" "}
                <ExternalLinkText
                  href="https://uses.tech"
                  className="text-primary hover:underline inline-flex items-center"
                  iconClassName="h-4 w-4 ml-1"
                >
                  uses.tech
                </ExternalLinkText>
                , a website where people share the stuff they use.
              </p>
            </div>

            <div className="flex flex-col gap-12">
              {categories.slice(0, 10).map((category) => (
                <div key={category.title} id={`category-${category.title}`}>
                  <CategoryHeader
                    iconName={category.iconName}
                    iconMap={iconMap}
                    variant="subtle"
                    title={
                      staticCategoryTitles[category.title] || category.title
                    }
                  />
                  <div className="grid gap-6 ml-4">
                    {category.items.map((item, index) => (
                      <UsesItem key={index} item={item} />
                    ))}
                  </div>
                </div>
              ))}

              {categories[10] && (
                <div id="category-multimedia">
                  <CategoryHeader
                    iconName={categories[10].iconName}
                    iconMap={iconMap}
                    variant="subtle"
                    title={
                      staticCategoryTitles[categories[10].title] ||
                      categories[10].title
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
                    {categories[10].subsections?.map((subsection, subIndex) => (
                      <div key={subIndex} className="space-y-6">
                        <div className="flex items-center gap-2 mb-3">
                          {subsection.iconName && (
                            <div className="bg-primary/5 p-1.5 rounded-full">
                              {renderIcon(subsection.iconName, "h-5 w-5")}
                            </div>
                          )}
                          <h3 className="text-xl font-medium">
                            {staticCategoryTitles[subsection.title] ||
                              subsection.title}
                          </h3>
                        </div>
                        <div className="grid gap-6 ml-4">
                          {subsection.items
                            .filter(
                              (item) =>
                                item.name !== "Unspeakable Platform 1" &&
                                item.name !== "Unspeakable Platform 2"
                            )
                            .map((item, itemIndex) => (
                              <UsesItem key={itemIndex} item={item} />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  const getTranslatedDescription = (item: SerializableUsesItem) =>
    item.descriptionKey
      ? t(`uses.itemDescriptions.${item.descriptionKey}`)
      : item.description

  const renderCategory = (
    category: SerializableUsesCategory,
    index: number
  ) => (
    <div
      ref={(el) => {
        categoryRefs.current[index] = el
      }}
      id={`category-${category.title}`}
      className="transition-all duration-300"
    >
      <CategoryHeader
        iconName={category.iconName}
        iconMap={iconMap}
        variant="subtle"
        title={t(`uses.categories.${category.title}`)}
      />
      <div className="grid gap-6 ml-4">
        {category.items.map((item, itemIndex) => (
          <UsesItem
            key={itemIndex}
            item={item}
            descriptionText={getTranslatedDescription(item)}
          />
        ))}
      </div>
    </div>
  )

  const renderMultimediaSubsectionItem = (
    item: SerializableUsesItem,
    itemIndex: number
  ) => {
    if (item.name === "Unspeakable Platform 1") {
      return (
        <HiddenPlatformItem
          key={itemIndex}
          platformId="platform1"
          clicks={revancedClicks}
          onClick={handleRevancedClick}
          revealedName="ReVanced"
          revealedDescriptionKey="revancedDescription"
        />
      )
    }

    if (item.name === "Unspeakable Platform 2") {
      return (
        <HiddenPlatformItem
          key={itemIndex}
          platformId="platform2"
          clicks={stremioClicks}
          onClick={handleStremioClick}
          revealedName="Stremio"
          revealedDescriptionKey="stremioDescription"
        />
      )
    }

    return (
      <UsesItem
        key={itemIndex}
        item={item}
        descriptionText={getTranslatedDescription(item)}
      />
    )
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden transition-opacity duration-300 opacity-100">
      <DarkModeFirefly count={15} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              {t("uses.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("uses.description")}{" "}
              <ExternalLinkText
                href="https://uses.tech"
                className="text-primary hover:underline inline-flex items-center"
                iconClassName="h-4 w-4 ml-1"
              >
                uses.tech
              </ExternalLinkText>
              , {t("uses.websiteDescription")}
            </p>
          </div>

          <div
            className="sr-only"
            aria-live="polite"
            id="keyboard-announcement"
          />

          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {renderCategory(categories[0], 0)}
              {renderCategory(categories[1], 1)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {renderCategory(categories[2], 2)}
              {renderCategory(categories[3], 3)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {renderCategory(categories[4], 4)}
              {renderCategory(categories[5], 5)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {renderCategory(categories[6], 6)}
              {renderCategory(categories[7], 7)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {renderCategory(categories[8], 8)}
              {renderCategory(categories[9], 9)}
            </div>

            {/* Multimedia section */}
            <div
              className="lg:col-span-2 transition-all duration-300"
              ref={(el) => {
                categoryRefs.current[10] = el
              }}
              id="category-multimedia"
            >
              <CategoryHeader
                iconName={categories[10].iconName}
                iconMap={iconMap}
                variant="subtle"
                title={t(`uses.categories.${categories[10].title}`)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
                {categories[10].subsections?.map((subsection, subIndex) => (
                  <div key={subIndex} className="space-y-6">
                    <div className="flex items-center gap-2 mb-3">
                      {subsection.iconName && (
                        <div className="bg-primary/5 p-1.5 rounded-full">
                          {renderIcon(subsection.iconName, "h-5 w-5")}
                        </div>
                      )}
                      <h3 className="text-xl font-medium">
                        {t(`uses.subsections.${subsection.title}`)}
                      </h3>
                    </div>

                    <div className="grid gap-6 ml-4">
                      {subsection.items.map(renderMultimediaSubsectionItem)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
