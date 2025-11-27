"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import { useMounted } from "@/hooks/use-mounted"
import { ExternalLink, Lock, EyeOff } from "lucide-react"
import { USES_CATEGORIES, type UsesCategory } from "@/content/uses-items"

export default function UsesClientPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const mounted = useMounted()
  const [revancedClicks, setRevancedClicks] = useState(0)
  const [stremioClicks, setStremioClicks] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  // Memoize categories to prevent recreation on every render
  const categories = useMemo(() => USES_CATEGORIES, [])

  // Memoize callback functions
  const handleRevancedClick = useCallback(() => {
    setRevancedClicks((prev) => prev + 1)
  }, [])

  const handleStremioClick = useCallback(() => {
    setStremioClicks((prev) => prev + 1)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Skip if user is typing in an input, textarea, or contentEditable element
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        // Check if the key pressed is a number between 1-9, 0 for 10th, or - for 11th
        let categoryIndex = -1
        if (e.key >= "1" && e.key <= "9") {
          categoryIndex = Number.parseInt(e.key) - 1
        } else if (e.key === "0") {
          categoryIndex = 9 // 10th category
        } else if (e.key === "-") {
          categoryIndex = 10 // 11th category
        }

        if (categoryIndex >= 0 && categoryIndex < categoryRefs.current.length) {
          e.preventDefault()

          // Scroll to the category
          if (categoryRefs.current[categoryIndex]) {
            categoryRefs.current[categoryIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            // Add a brief highlight effect
            const categoryElement = categoryRefs.current[categoryIndex]
            if (categoryElement) {
              categoryElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
              setTimeout(() => {
                categoryElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
              }, 1000)

              // Announce to screen readers
              const categoryTitle = categoryElement.querySelector("h2")?.textContent
              const announcement = document.getElementById("keyboard-announcement")
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

  return (
    <main className={`relative min-h-screen w-full overflow-hidden transition-opacity duration-300 ${mounted && isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {mounted && theme === "dark" && <Firefly count={15} />}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{t("uses.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("uses.description")}{" "}
              <Link
                href="https://uses.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                uses.tech
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
              , {t("uses.websiteDescription")}
            </p>
          </div>

          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite" id="keyboard-announcement"></div>

          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div
                ref={(el) => { categoryRefs.current[0] = el }}
                id="category-hardware"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[0].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[0].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[0].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={(el) => { categoryRefs.current[1] = el }}
                id="category-mobile"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[1].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[1].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[1].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div
                ref={(el) => { categoryRefs.current[2] = el }}
                id="category-audio"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[2].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[2].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[2].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={(el) => { categoryRefs.current[3] = el }}
                id="category-os"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[3].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[3].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[3].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div
                ref={(el) => { categoryRefs.current[4] = el }}
                id="category-development"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[4].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[4].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[4].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={(el) => { categoryRefs.current[5] = el }}
                id="category-email"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[5].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[5].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[5].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div
                ref={(el) => { categoryRefs.current[6] = el }}
                id="category-privacy"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[6].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[6].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[6].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={(el) => { categoryRefs.current[7] = el }}
                id="category-mobile_tools"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[7].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[7].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[7].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div
                ref={(el) => { categoryRefs.current[8] = el }}
                id="category-mapping"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[8].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[8].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[8].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={(el) => { categoryRefs.current[9] = el }}
                id="category-gaming"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[9].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[9].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[9].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="lg:col-span-2 transition-all duration-300"
              ref={(el) => { categoryRefs.current[10] = el }}
              id="category-multimedia"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">{categories[10].icon}</div>
                <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[10].title}`)}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
                {categories[10].subsections?.map((subsection, subIndex) => (
                  <div key={subIndex} className="space-y-6">
                    <div className="flex items-center gap-2 mb-3">
                      {subsection.icon && <div className="bg-primary/5 p-1.5 rounded-full">{subsection.icon}</div>}
                      <h3 className="text-xl font-medium">{t(`uses.subsections.${subsection.title}`)}</h3>
                    </div>

                    <div className="grid gap-6 ml-4">
                      {subsection.items.map((item, itemIndex) => {
                        // Special handling for the "unspeakable platforms"
                        if (item.name === "Unspeakable Platform 1") {
                          return (
                            <div key={itemIndex} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                              <div className="cursor-pointer group" onClick={handleRevancedClick}>
                                <h4 className="text-lg font-medium flex items-center">
                                  {revancedClicks >= 5 ? (
                                    <>
                                      ReVanced
                                      <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex items-center">
                                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {t("uses.hiddenPlatforms.platform1")}
                                      </span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({5 - revancedClicks} {t("uses.itemDescriptions.clicksRemaining")})
                                      </span>
                                    </>
                                  )}
                                </h4>
                                <p className="text-muted-foreground">
                                  {revancedClicks >= 5
                                    ? t(`uses.itemDescriptions.revancedDescription`)
                                    : t("uses.hiddenPlatforms.click5")}
                                </p>
                              </div>
                            </div>
                          )
                        }

                        if (item.name === "Unspeakable Platform 2") {
                          return (
                            <div key={itemIndex} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                              <div className="cursor-pointer group" onClick={handleStremioClick}>
                                <h4 className="text-lg font-medium flex items-center">
                                  {stremioClicks >= 5 ? (
                                    <>
                                      Stremio
                                      <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex items-center">
                                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {t("uses.hiddenPlatforms.platform2")}
                                      </span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({5 - stremioClicks} {t("uses.itemDescriptions.clicksRemaining")})
                                      </span>
                                    </>
                                  )}
                                </h4>
                                <p className="text-muted-foreground">
                                  {stremioClicks >= 5
                                    ? t(`uses.itemDescriptions.stremioDescription`)
                                    : t("uses.hiddenPlatforms.click5")}
                                </p>
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div key={itemIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                            <div>
                              <h4 className="text-lg font-medium">
                                {item.link ? (
                                  <Link
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary inline-flex items-center"
                                  >
                                    {item.name}
                                    <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                                  </Link>
                                ) : (
                                  item.name
                                )}
                              </h4>
                              {item.descriptionKey ? (
                                <p className="text-muted-foreground">
                                  {t(`uses.itemDescriptions.${item.descriptionKey}`)}
                                </p>
                              ) : (
                                <p className="text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
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
