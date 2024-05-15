"use client"
import Link from "next/link"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/useSidebar"
import { buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"

// interface SideNavProps {
//     items: any[];
//     setOpen?: (open: boolean) => void;
//     className?: string;
// }

export function SideNav({ searches, setCurrentSearch, className }: any) {
  const path = usePathname()
  const { isOpen } = useSidebar()
  const [openItem, setOpenItem] = useState("")
  const [lastOpenItem, setLastOpenItem] = useState("")

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem)
    } else {
      setLastOpenItem(openItem)
      setOpenItem("")
    }
  }, [isOpen])

  return (
    <nav className="space-y-2 overflow-y-auto h-[1900px]">
      {searches.map((search: any) => (
        <div
          key={search.id}
          onClick={() => setCurrentSearch(search)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group relative flex h-auto cursor-pointer flex-col items-start overflow-hidden",
            path === search.href && "bg-muted font-bold hover:bg-muted"
          )}
        >
          <span
            className={cn(
              "overflow-hidden text-base duration-200",
              !isOpen && className
            )}
          >
            {search.query.slice(0, 28)}
          </span>
          <small>{search.id}</small>
        </div>
      ))}
    </nav>
  )
}
