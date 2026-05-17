'use client'

import { motion } from 'framer-motion'
import { tweenSmooth } from '@/lib/motion'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

interface SkeletonRowsProps {
  columnCount: number
  rowCount?: number
}

export function SkeletonRows({ columnCount, rowCount = 10 }: SkeletonRowsProps) {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={i} className="border-white/[0.06] hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, j) => (
            <TableCell key={j} className="py-3 px-4">
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{
                  ...tweenSmooth,
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.06 + j * 0.03,
                }}
                className="h-3.5 rounded-md bg-white/[0.06]"
                style={{
                  width: j === 0 ? '55%' : j === columnCount - 1 ? '35%' : '75%',
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
