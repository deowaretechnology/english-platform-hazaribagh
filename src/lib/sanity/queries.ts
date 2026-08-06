import { sanityClient } from "./client";
import { urlFor } from "./image";
import {
  Course,
  Video,
  Note,
  Test,
  Topper,
  Testimonial,
  FAQItem,
} from "../../types";
import { coursesData } from "../../data/courses";
import { videosData } from "../../data/videos";
import { notesData } from "../../data/notes";
import { testsData } from "../../data/tests";
import { toppersData } from "../../data/toppers";
import { testimonialsData } from "../../data/testimonials";
import { faqsData } from "../../data/faqs";

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  classLevel: string;
  url: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}

export interface TeacherItem {
  id: string;
  name: string;
  designation: string;
  experience: string;
  bio: string;
  photoUrl: string;
  subjects: string[];
}

// GROQ Queries
export async function fetchCoursesFromSanity(): Promise<Course[]> {
  try {
    const query = `*[_type == "course"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      classLevel,
      mode,
      badge,
      description,
      price,
      originalPrice,
      duration,
      batchTiming,
      language,
      ctaText,
      thumbnail,
      features,

      "teacher": teacher->{
        _id,
        name,
        designation,
        experience,
        photo
      },

      order
    }`;

    const raw: any[] = await sanityClient.fetch(query);

    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item.slug || item._id || `course-${idx}`,

        title: item.title || "English Mastery Batch",

        subtitle:
          item.description ||
          "Comprehensive board exam preparation",

        class: item.classLevel || "10",

        price:
          typeof item.price === "number"
            ? item.price
            : 3499,

        originalPrice:
          typeof item.originalPrice === "number"
            ? item.originalPrice
            : 4999,

        duration:
          item.duration ||
          "1 Year Full Course",

        batchTiming:
          item.batchTiming ||
          "Morning: 07:00 AM - 08:30 AM",

        mode: item.mode || "Offline",

        seatsLeft: 12,

        isPopular: !!item.badge,

        badge: item.badge,

        language:
          item.language ||
          "Bilingual (English / Hindi)",

        ctaText:
          item.ctaText ||
          "Enroll in Batch",

        thumbnail: item.thumbnail,

        features:
          Array.isArray(item.features) && item.features.length > 0
            ? item.features
            : [
                "Complete NCERT",
                "Grammar & Prose"
              ],

        // Teacher object
        teacher: item.teacher || null,

        // Display string
        instructor: item.teacher
          ? `${item.teacher.name}${
              item.teacher.experience
                ? ` (${item.teacher.experience})`
                : ""
            }`
          : "Faculty will be announced",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch courses from Sanity:", err);
  }

  return coursesData;
}

export async function fetchVideosFromSanity(): Promise<Video[]> {
  try {
    const query = `*[_type in ["video", "videos"]] {
      _id,
      title,
      "classLevel": coalesce(classLevel, class, "10"),
      chapter,
      duration,
      youtubeUrl,
      youtubeId,
      thumbnail,
      photo,
      notes
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => {
        let ytId = item.youtubeId || "dQw4w9WgXcQ";
        if (item.youtubeUrl) {
          const match = item.youtubeUrl.match(
            /(?:v=|\/embed\/|\/1\/|\/v\/|https:\/\/youtu\.be\/|\/e\/)([^#&?]*)/,
          );
          if (match && match[1]) {
            ytId = match[1];
          }
        }
        return {
          id: item._id || `vid-${idx}`,
          title: item.title || "Video Lecture",
          class: (item.classLevel as any) || "10",
          chapter: item.chapter || "Grammar & Literature",
          youtubeId: ytId,
          duration: item.duration || "45 mins",
          views: "1.2k",
          uploadDate: "Latest",
          notesSummary:
            item.notes ||
            "Full conceptual breakdown of chapter grammar and question answers.",
        };
      });
    }
  } catch (err) {
    console.warn("Failed to fetch videos from Sanity:", err);
  }
  return videosData;
}

export async function fetchNotesFromSanity(): Promise<Note[]> {
  try {
    const query = `*[_type in ["note", "notes", "studyMaterial"]] {
      _id,
      title,
      "classLevel": coalesce(classLevel, class, "10"),
      subject,
      chapter,
      pages,
      fileSize,
      previewHighlights,
      "pdfUrl": coalesce(pdfFile.asset->url, pdfUrl, file.asset->url, attachment.asset->url)
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `note-${idx}`,
        title: item.title || "Chapter Study Material",
        class: (item.classLevel as any) || "10",
        subject: item.subject || "English Literature & Grammar",
        chapter: item.chapter || item.title || "Notes",
        pages: item.pages || 8,
        fileSize: item.fileSize || "2.4 MB",
        pdfUrl: item.pdfUrl || "",
        previewHighlights:
          Array.isArray(item.previewHighlights) &&
          item.previewHighlights.length > 0
            ? item.previewHighlights
            : [
                "Comprehensive Rule Book",
                "Previous Years Solved Questions",
                "Model Answer Key",
              ],
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch notes from Sanity:", err);
  }
  return notesData;
}

export async function fetchResourceLinksFromSanity(): Promise<ResourceLink[]> {
  try {
    const query = `*[_type == "resourceLink"] {
      _id,
      title,
      classLevel,
      url
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (raw && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `res-${idx}`,
        title: item.title || "Important External Study Material",
        classLevel: item.classLevel || "10",
        url: item.url || "https://jac.jharkhand.gov.in/",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch resource links from Sanity:", err);
  }
  return [
    {
      id: "res-1",
      title: "JAC Board Official English Model Papers 2026",
      classLevel: "10",
      url: "https://jac.jharkhand.gov.in/",
    },
    {
      id: "res-2",
      title: "CBSE Class 12 Sample Question Papers & Marking Scheme",
      classLevel: "12",
      url: "https://cbseacademic.nic.in/",
    },
    {
      id: "res-3",
      title: "English Grammar & Composition Online Practice Portal",
      classLevel: "all",
      url: "https://www.grammarly.com/",
    },
  ];
}

export async function fetchToppersFromSanity(): Promise<Topper[]> {
  try {
    const query = `*[_type in ["topper", "toppers"]] {
      _id,
      name,
      achievement,
      "classTag": coalesce(classTag, classLevel, class, "Class 10 / 12"),
      year,
      photo,
      quote,
      school
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `top-${idx}`,
        name: item.name || "Topper Student",
        achievement: item.achievement || "95%+ in JAC Boards",
        classTag: item.classTag || "Class 10 / 12",
        year: item.year || "2025",
        photoUrl:
          urlFor(item.photo) ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        quote:
          item.quote ||
          "English Platform guided me through every grammar rule and letter format with clarity.",
        school: item.school || "Hazaribagh District High School",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch toppers from Sanity:", err);
  }
  return toppersData;
}

export async function fetchTestsFromSanity(): Promise<Test[]> {
  try {
    const query = `*[_type in ["test", "tests", "mockTest"]] {
      _id,
      title,
      "slug": coalesce(slug.current, _id),
      "classLevel": coalesce(classLevel, class, "10"),
      type,
      date,
      status,
      durationMinutes,
      marks,
      "questionCount": count(*[_type == "question" && (testRef->_id == ^._id || testRef->slug.current == ^.slug.current)])
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item.slug || item._id || `test-${idx}`,
        title: item.title || "Sunday OMR Mock Test",
        class: (item.classLevel as any) || "10",
        type: (item.type as any) || "Weekly OMR",
        totalQuestions: item.questionCount > 0 ? item.questionCount : 20,
        marks: item.marks || 50,
        durationMinutes: item.durationMinutes || 30,
        date: item.date || "Every Sunday, 10:00 AM",
        status: (item.status as any) || "Active",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch tests from Sanity:", err);
  }
  return testsData;
}

export async function fetchFAQsFromSanity(): Promise<FAQItem[]> {
  try {
    const query = `*[_type in ["faq", "faqs"]] | order(order asc) {
      _id,
      question,
      answer,
      category
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `faq-${idx}`,
        question: item.question,
        answer: item.answer,
        category: item.category || "General",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch FAQs from Sanity:", err);
  }
  return faqsData;
}

export async function fetchTestimonialsFromSanity(): Promise<Testimonial[]> {
  try {
    const query = `*[_type in ["testimonial", "testimonials", "review"]] {
      _id,
      name,
      "roleOrClass": coalesce(roleOrClass, classTag, role, "Student"),
      "comment": coalesce(comment, quote, text, "Great coaching experience"),
      photo,
      rating,
      year
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `testi-${idx}`,
        name: item.name || "Student",
        roleOrClass: item.roleOrClass || "Board Student",
        photoUrl:
          urlFor(item.photo) ||
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
        comment: item.comment || "Excellent teaching and guidance.",
        rating: item.rating || 5,
        year: item.year || "2025",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch testimonials from Sanity:", err);
  }
  return testimonialsData;
}

export async function fetchGalleryFromSanity(): Promise<GalleryItem[]> {
  try {
    const query = `*[_type in ["gallery", "galleryImage", "photos"]] {
      _id,
      title,
      caption,
      photo,
      image,
      "url": coalesce(image.asset->url, photo.asset->url, imageUrl)
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `gal-${idx}`,
        url:
          item.url ||
          urlFor(item.photo || item.image) ||
          "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
        title: item.title || "Campus Image",
        caption: item.caption || "English Platform Hazaribagh Campus",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch gallery from Sanity:", err);
  }
  return [];
}

export async function fetchAnnouncementsFromSanity(): Promise<
  AnnouncementItem[]
> {
  try {
    const query = `*[_type == "announcement" && isActive == true] | order(publishedAt desc) {
      _id,
      title,
      message,
      type,
      link
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (raw && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `ann-${idx}`,
        title: item.title,
        message: item.message,
        type: item.type || "info",
        link: item.link,
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch announcements from Sanity:", err);
  }
  return [];
}

export async function fetchTeachersFromSanity(): Promise<TeacherItem[]> {
  try {
    const query = `*[_type == "teacher"] {
      _id,
      name,
      designation,
      experience,
      bio,
      photo,
      subjects
    }`;
    const raw: any[] = await sanityClient.fetch(query);
    if (raw && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item._id || `teacher-${idx}`,
        name: item.name,
        designation: item.designation,
        experience: item.experience,
        bio: item.bio,
        photoUrl: urlFor(item.photo),
        subjects: item.subjects || [],
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch teachers from Sanity:", err);
  }
  return [];
}

function extractOptionsFromSanityQ(q: any): string[] {
  if (Array.isArray(q.options) && q.options.length > 0) {
    const filtered = q.options
      .filter(
        (o: any) =>
          o !== undefined && o !== null && String(o).trim().length > 0,
      )
      .map((o: any) => String(o).trim());
    if (filtered.length > 0) return filtered;
  }
  const opts: string[] = [];
  if (q.optionA && String(q.optionA).trim())
    opts.push(String(q.optionA).trim());
  if (q.optionB && String(q.optionB).trim())
    opts.push(String(q.optionB).trim());
  if (q.optionC && String(q.optionC).trim())
    opts.push(String(q.optionC).trim());
  if (q.optionD && String(q.optionD).trim())
    opts.push(String(q.optionD).trim());

  if (opts.length > 0) return opts;

  if (q.a) opts.push(String(q.a).trim());
  if (q.b) opts.push(String(q.b).trim());
  if (q.c) opts.push(String(q.c).trim());
  if (q.d) opts.push(String(q.d).trim());

  return opts;
}

export async function fetchTestQuestionsForStudent(testIdOrSlug: string) {
  try {
    // 1. Fetch from inline test questions in Sanity
    const testDocQuery = `*[_type in ["test", "tests", "mockTest"] && (slug.current == $id || _id == $id)][0] {
      _id,
      title,
      classLevel,
      questions[] {
        _key,
        _id,
        questionText,
        question,
        options,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        correctOption,
        explanation
      }
    }`;
    const testDoc: any = await sanityClient.fetch(testDocQuery, {
      id: testIdOrSlug,
    });
    if (
      testDoc &&
      Array.isArray(testDoc.questions) &&
      testDoc.questions.length > 0
    ) {
      return testDoc.questions.map((q: any, idx: number) => ({
        id: q._id || q._key || `q-${idx}`,
        questionText: q.questionText || q.question || `Question ${idx + 1}`,
        options: extractOptionsFromSanityQ(q),
        correctAnswer: q.correctAnswer ?? q.correctOption ?? 0,
        explanation: q.explanation || "",
      }));
    }

    // 2. Fetch standalone question documents in Sanity
    const query = `*[_type == "question" && (testRef->_id == $id || testRef->slug.current == $id || classLevel == $id || testSlug == $id)] {
      _id,
      questionText,
      question,
      classLevel,
      options,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      correctOption,
      explanation
    }`;
    const raw: any[] = await sanityClient.fetch(query, { id: testIdOrSlug });
    if (raw && raw.length > 0) {
      return raw.map((q, idx) => ({
        id: q._id || `q-${idx}`,
        questionText: q.questionText || q.question || `Question ${idx + 1}`,
        options: extractOptionsFromSanityQ(q),
        correctAnswer: q.correctAnswer ?? q.correctOption ?? 0,
        explanation: q.explanation || "",
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch Sanity test questions directly:", err);
  }

  // 3. Fallback to local static testsData
  const matchedTest =
    testsData.find((t) => t.id === testIdOrSlug) || testsData[0];
  if (matchedTest && Array.isArray(matchedTest.questions)) {
    return matchedTest.questions.map((q, idx) => ({
      id: q.id || `q-${idx}`,
      questionText: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || "",
    }));
  }

  return [];
}
