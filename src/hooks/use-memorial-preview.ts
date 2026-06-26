"use client";

import { useState, useEffect, useMemo } from "react";

interface TimelineEvent {
  year?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface GalleryItem {
  url?: string;
  title?: string;
}

export interface MemorialPreviewData {
  name?: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
  epitaph?: string;
  biography?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  timelineEvents?: TimelineEvent[];
  gallery?: GalleryItem[];
}

export function useMemorialPreview(isOpen: boolean, data: MemorialPreviewData) {
  const [showMemorial, setShowMemorial] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Loading transition when preview opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowMemorial(true), 2500);
      return () => {
        clearTimeout(timer);
        setShowMemorial(false);
      };
    }
  }, [isOpen]);

  // Audio wave visualizer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Disable body scroll when preview is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      const originalHtmlStyle = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle || "";
        document.documentElement.style.overflow = originalHtmlStyle || "";
      };
    }
  }, [isOpen]);

  const toggleAudio = () => setIsPlayingAudio((prev) => !prev);

  return {
    showMemorial,
    isPlayingAudio,
    audioProgress,
    toggleAudio,
  };
}

export function useMemorialYears(birthDate?: string, deathDate?: string) {
  return useMemo(() => {
    const getYear = (dateStr?: string) => {
      if (!dateStr) return "????";
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.getFullYear().toString();
      }
      const match = dateStr.match(/(\d{4})/);
      if (match) return match[1];
      return "????";
    };
    const birth = getYear(birthDate);
    const death = getYear(deathDate);
    return `${birth} - ${death}`;
  }, [birthDate, deathDate]);
}

export function useMemorialContent(data: MemorialPreviewData) {
  const validTimeline = useMemo(
    () => data.timelineEvents?.filter((e) => e.year || e.title || e.description || e.imageUrl) || [],
    [data.timelineEvents]
  );

  const validGallery = useMemo(
    () => data.gallery?.filter((g) => g.url) || [],
    [data.gallery]
  );

  const biographyParagraphs = useMemo(() => {
    if (!data.biography) {
      return [
        "A história de vida, conquistas, momentos marcantes e lições valiosas aparecerão renderizadas nesta seção solene para que todos que escanearem o QR code se recordem do legado.",
      ];
    }
    return data.biography.split("\n").filter((p) => p.trim() !== "");
  }, [data.biography]);

  return { validTimeline, validGallery, biographyParagraphs };
}

export function useMemorialInteractions() {
  const [heartsCount] = useState(12);
  const [flowersCount] = useState(3);
  const [candlesList] = useState<
    { id: string; name: string; createdAt: Date; isEternal?: boolean }[]
  >([
    { id: "1", name: "Família Silva", createdAt: new Date() },
    { id: "2", name: "Amigo Próximo", createdAt: new Date(), isEternal: true },
    { id: "3", name: "Maria de Lourdes", createdAt: new Date() },
  ]);

  const [showTributeModal, setShowTributeModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [tributes] = useState<
    { id: string; author: string; message: string; date: string }[]
  >([
    {
      id: "1",
      author: "Família Silva",
      message: "Sempre será lembrado com muito carinho e saudade.",
      date: "Hoje",
    },
  ]);

  const handleLightCandle = () => {};
  const handleSendFlower = () => {};
  const handleTouchHeart = () => {};

  const handleLeaveTribute = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return {
    heartsCount,
    flowersCount,
    candlesList,
    showTributeModal,
    setShowTributeModal,
    newAuthor,
    setNewAuthor,
    newMessage,
    setNewMessage,
    tributes,
    handleLightCandle,
    handleSendFlower,
    handleTouchHeart,
    handleLeaveTribute,
  };
}
