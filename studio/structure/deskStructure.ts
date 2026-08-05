import { StructureResolver } from 'sanity/structure';
import {
  BookIcon,
  PlayIcon,
  DocumentIcon,
  HelpCircleIcon,
  UserIcon,
  StarIcon,
  VideoIcon,
  DocumentTextIcon,
  BellIcon,
  ImageIcon,
  UsersIcon,
  InfoOutlineIcon,
  MobileDeviceIcon,
  CogIcon,
  SearchIcon,
  HomeIcon,
  LinkIcon,
  ComponentIcon,
  TaskIcon
} from '@sanity/icons';

const singletonTypes = new Set([
  'websiteSettings',
  'seoSettings',
  'homepageSections',
  'admissionInfo',
  'contactInfo',
  'banner'
]);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('English Platform Content Desk')
    .items([
      // Singleton: Website Settings & Controls
      S.listItem()
        .title('Website Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('websiteSettings')
            .documentId('websiteSettings')
            .title('Website Global Settings')
        ),

      S.listItem()
        .title('SEO Settings')
        .icon(SearchIcon)
        .child(
          S.document()
            .schemaType('seoSettings')
            .documentId('seoSettings')
            .title('Global SEO & Meta Config')
        ),

      S.listItem()
        .title('Homepage Sections')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepageSections')
            .documentId('homepageSections')
            .title('Homepage Structure Controls')
        ),

      S.divider(),

      // Core Learning Content
      S.listItem()
        .title('Courses & Batches')
        .icon(BookIcon)
        .child(S.documentTypeList('course').title('All Courses')),

      S.listItem()
        .title('Course Modules')
        .icon(ComponentIcon)
        .child(S.documentTypeList('module').title('All Modules')),

      S.listItem()
        .title('Lessons & Lectures')
        .icon(PlayIcon)
        .child(S.documentTypeList('lesson').title('All Lessons')),

      S.divider(),

      // Online Test Series (With embedded Question Cards)
      S.listItem()
        .title('Test Series')
        .icon(TaskIcon)
        .child(S.documentTypeList('test').title('Sunday OMR & Board Tests')),

      S.divider(),

      // Media & PDF Downloads
      S.listItem()
        .title('Video Lectures')
        .icon(VideoIcon)
        .child(S.documentTypeList('video').title('YouTube & Video Materials')),

      S.listItem()
        .title('Study Notes (PDFs)')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('note').title('Chapter PDF Notes')),

      S.listItem()
        .title('Resource Links')
        .icon(LinkIcon)
        .child(S.documentTypeList('resourceLink').title('Important External Links')),

      S.divider(),

      // Social Proof & Faculty
      S.listItem()
        .title('Topper Students')
        .icon(StarIcon)
        .child(S.documentTypeList('topper').title('JAC & Board Toppers')),

      S.listItem()
        .title('Student Testimonials')
        .icon(UserIcon)
        .child(S.documentTypeList('testimonial').title('Student Reviews')),

      S.listItem()
        .title('Faculty & Teachers')
        .icon(UsersIcon)
        .child(S.documentTypeList('teacher').title('Teaching Faculty')),

      S.divider(),

      // Announcements, Banner & Gallery
      S.listItem()
        .title('Hero Banner')
        .icon(ImageIcon)
        .child(
          S.document()
            .schemaType('banner')
            .documentId('banner')
            .title('Hero Banner Settings')
        ),

      S.listItem()
        .title('Announcements')
        .icon(BellIcon)
        .child(S.documentTypeList('announcement').title('Live Alerts')),

      S.listItem()
        .title('Photo Gallery')
        .icon(ImageIcon)
        .child(S.documentTypeList('gallery').title('Classroom & Event Photos')),

      S.listItem()
        .title('FAQs')
        .icon(HelpCircleIcon)
        .child(S.documentTypeList('faq').title('Frequently Asked Questions')),

      S.divider(),

      // Singletons: Info & Contact
      S.listItem()
        .title('Admission Information')
        .icon(InfoOutlineIcon)
        .child(
          S.document()
            .schemaType('admissionInfo')
            .documentId('admissionInfo')
            .title('Admission Guidelines')
        ),

      S.listItem()
        .title('Contact Information')
        .icon(MobileDeviceIcon)
        .child(
          S.document()
            .schemaType('contactInfo')
            .documentId('contactInfo')
            .title('Hazaribagh Center Contact Details')
        ),

      // Filter out singletons from generic list
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() || '')
      ),
    ]);
