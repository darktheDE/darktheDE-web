"use client";

import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiFacebook,
} from "react-icons/fi";
import { SOCIAL_LINKS } from "@/data/config";
import { cn } from "@/lib/cn";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
  { name: "Projects", href: "#projects" },
  { name: "RTIC", href: "#rtic" },
  { name: "Awards", href: "#certifications" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        "fixed top-0 w-full transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
      style={{ zIndex: "var(--z-nav)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "rounded-full px-6 py-3 transition-all duration-300",
            scrolled
              ? "bg-background/80 backdrop-blur-md border border-rule shadow-lg"
              : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-xl font-bold font-mono tracking-tighter text-text hover:text-accent transition-colors"
            >
              darkthe<span className="text-accent">DE</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-mute hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="w-px h-4 bg-rule" />

              <div className="flex items-center gap-4">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute hover:text-accent transition-colors"
                  aria-label="GitHub Profile"
                >
                  <FiGithub size={18} />
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute hover:text-accent transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <FiLinkedin size={18} />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute hover:text-accent transition-colors"
                  aria-label="Facebook Profile"
                >
                  <FiFacebook size={18} />
                </a>
                <a
                  href={SOCIAL_LINKS.email}
                  className="text-mute hover:text-accent transition-colors"
                  aria-label="Send Email"
                >
                  <FiMail size={18} />
                </a>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-text p-2 hover:bg-rule rounded-full transition-colors"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-surface/95 backdrop-blur-xl border border-rule rounded-2xl p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-mute hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-rule my-2" />
              <div className="flex justify-center gap-6 pt-2">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute hover:text-accent"
                  aria-label="GitHub Profile"
                >
                  <FiGithub size={24} />
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute hover:text-accent"
                  aria-label="LinkedIn Profile"
                >
                  <FiLinkedin size={24} />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute hover:text-accent"
                  aria-label="Facebook Profile"
                >
                  <FiFacebook size={24} />
                </a>
                <a
                  href={SOCIAL_LINKS.email}
                  className="text-mute hover:text-accent"
                  aria-label="Send Email"
                >
                  <FiMail size={24} />
                </a>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}