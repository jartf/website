"use client"

import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import { KeyboardNavigation } from "@/components/keyboard-navigation"
import { Galaxy } from "@/components/galaxy/galaxy"

export function StargazeClient() {
	const { resolvedTheme } = useTheme()
	const mounted = useMounted()

	// Prevent hydration mismatch
	if (!mounted) return null

	// Full-viewport, no UI, just background and keyboard nav
	return (
		<div className="fixed inset-0 min-h-screen min-w-full bg-background">
			<Galaxy />
			<KeyboardNavigation />
		</div>
	)
}
