import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { fetchCoursesFromSanity } from "../lib/sanity/queries";
import { ClassFilter } from "../components/ui/ClassFilter";
import { ClassLevel, Course } from "../types";

export const CoursesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialClass = (searchParams.get("class") as ClassLevel) || "all";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(initialClass);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const fetched = await fetchCoursesFromSanity();
        setCourses(fetched);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesClass = selectedClass === "all" || c.class === selectedClass;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.features.some((f) =>
        f.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesClass && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Academic Catalog & Fee Structure</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Target Batches & Fee Structure
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Explore complete course details for Class 9th, 10th, 11th, 12th Board
          exams, Spoken English, and Competitive preparation at Hazaribagh
          campus.
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Class Filter Bar */}
        <ClassFilter
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          showAllOptions={true}
        />

        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by topic (e.g., Tenses, Grammar, Spoken, Board)..."
            className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Course List Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            Fetching course catalog from Sanity CMS...
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-xl relative overflow-hidden group"
              >
                {course.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs">
                    Most Enrolled
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] px-2.5 py-0.5 rounded uppercase">
                      Class {course.class}
                    </span>
                    <span className="bg-slate-100 text-slate-600 font-medium text-[11px] px-2.5 py-0.5 rounded">
                      {course.mode} Mode
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.subtitle}
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{course.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{course.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded ml-auto">
                        Save ₹{course.originalPrice - course.price}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 border-t border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{course.batchTiming}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Key Highlights:
                    </h4>
                    <ul className="space-y-2">
                      {course.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {/* Faculty & Seats */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex flex-col">
                      <span>
                        Faculty:{" "}
                        <strong className="text-slate-800">
                          {course.teacher?.name ??
                            course.instructor ??
                            "Faculty will be announced"}
                        </strong>
                      </span>

                      {course.teacher?.designation && (
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {course.teacher.designation}
                        </span>
                      )}

                      {course.teacher?.experience && (
                        <span className="text-[11px] text-slate-400">
                          {course.teacher.experience}
                        </span>
                      )}
                    </div>

                    <span className="text-blue-600 font-bold">
                      {course.seatsLeft} seats open
                    </span>
                  </div>

                  {/* Enroll Button */}
                  <Link
                    to={`/admission?course=${encodeURIComponent(course.title)}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <span>{course.ctaText || "Enroll in Batch"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 max-w-md mx-auto shadow-xs">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-lg">
              No courses found
            </h3>
            <p className="text-xs text-slate-500">
              Try selecting a different class filter or search query.
            </p>
            <button
              onClick={() => {
                setSelectedClass("all");
                setSearchQuery("");
              }}
              className="text-xs text-blue-600 font-bold hover:underline pt-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
