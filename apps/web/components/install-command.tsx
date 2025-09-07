"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Card } from "@repo/ui/components/card"
import { useStore, type PackageManager } from "@/lib/store"

interface InstallCommandProps {
  packages: string[]
  devDependencies?: boolean
  className?: string
}

const packageManagerCommands = {
  npm: (packages: string[], dev: boolean) => 
    `npm install ${dev ? '--save-dev ' : ''}${packages.join(' ')}`,
  yarn: (packages: string[], dev: boolean) => 
    `yarn add ${dev ? '--dev ' : ''}${packages.join(' ')}`,
  pnpm: (packages: string[], dev: boolean) => 
    `pnpm add ${dev ? '--save-dev ' : ''}${packages.join(' ')}`,
  bun: (packages: string[], dev: boolean) => 
    `bun add ${dev ? '--dev ' : ''}${packages.join(' ')}`
}

export function InstallCommand({ packages, devDependencies = false, className }: InstallCommandProps) {
  const { packageManager, setPackageManager } = useStore()
  const [copied, setCopied] = useState(false)

  const command = packageManagerCommands[packageManager](packages, devDependencies)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const managers: { value: PackageManager; label: string }[] = [
    { value: 'npm', label: 'npm' },
    { value: 'yarn', label: 'yarn' },
    { value: 'pnpm', label: 'pnpm' },
    { value: 'bun', label: 'bun' }
  ]

  return (
    <Card className={`p-0 overflow-hidden ${className} gap-0`}>
      {/* Package Manager Tabs */}
      <div className="flex border-b bg-muted/50">
        {managers.map((manager) => (
          <button
            key={manager.value}
            onClick={() => setPackageManager(manager.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              packageManager === manager.value
                ? 'bg-background border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {manager.label}
          </button>
        ))}
      </div>

      {/* Command Display */}
      <div className="relative">
        <pre className="p-4 bg-background font-mono text-sm overflow-x-auto">
          <code>{command}</code>
        </pre>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </Card>
  )
}
