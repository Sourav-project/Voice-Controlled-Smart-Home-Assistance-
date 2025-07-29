"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CallToAction() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Simplify Your Smart Home?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Join our early access program and be the first to experience the future of voice-controlled smart homes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="flex-grow" />
            <Link href="/dashboard" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700">Join Waitlist</Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500">We respect your privacy. Your information will never be shared.</p>
        </motion.div>
      </div>
    </section>
  )
}
