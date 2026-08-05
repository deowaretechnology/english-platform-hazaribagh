import type { Test } from "../types.js";

export const testsData: Test[] = [
  {
    id: 'test-10-weekly-omr-1',
    title: 'Class 10 Weekly OMR Grammar & Literature Sprint 01',
    class: '10',
    type: 'Weekly OMR',
    totalQuestions: 10,
    marks: 40,
    durationMinutes: 15,
    date: 'Active Now',
    status: 'Active',
    questions: [
      {
        id: 1,
        question: 'Identify the correct passive form: "The postman handed Lencho the letter."',
        options: [
          'Lencho was handed the letter by the postman.',
          'The letter is handed to Lencho by postman.',
          'Lencho had handed the letter to the postman.',
          'Postman has been handed letter by Lencho.'
        ],
        correctAnswer: 0,
        explanation: 'Simple past tense "handed" changes to "was/were + V3 (handed)". Option A is grammatically accurate.'
      },
      {
        id: 2,
        question: 'What did Lencho compare the large raindrops to?',
        options: [
          'Silver coins',
          'New coins (10 cent and 5 cent pieces)',
          'Diamonds',
          'Pearls'
        ],
        correctAnswer: 1,
        explanation: 'Lencho called the big drops 10 cent pieces and the little ones 5 cent pieces because rain promised a good harvest.'
      },
      {
        id: 3,
        question: 'Choose the correct indirect speech: He said, "I have completed my homework."',
        options: [
          'He said that he completed his homework.',
          'He said that he has completed his homework.',
          'He said that he had completed his homework.',
          'He said that he completes his homework.'
        ],
        correctAnswer: 2,
        explanation: 'Present perfect "have completed" changes to past perfect "had completed" in reported speech.'
      },
      {
        id: 4,
        question: 'Fill in the blank with suitable modal: "You _____ respect your elders."',
        options: ['can', 'must', 'ought to', 'may'],
        correctAnswer: 2,
        explanation: '"Ought to" expresses moral obligation or duty.'
      },
      {
        id: 5,
        question: 'Who is the author of "Nelson Mandela: Long Walk to Freedom"?',
        options: ['G.L. Fuentes', 'Nelson Rolihlahla Mandela', 'Robert Frost', 'Liam O\'Flaherty'],
        correctAnswer: 1,
        explanation: 'It is an extract from Nelson Mandela\'s autobiography.'
      },
      {
        id: 6,
        question: 'Find the synonym of "Avarice":',
        options: ['Generosity', 'Greed', 'Courage', 'Patience'],
        correctAnswer: 1,
        explanation: 'Avarice means extreme greed for wealth or material gain.'
      },
      {
        id: 7,
        question: 'In "A Tiger in the Zoo", where should the tiger ideally be lurking?',
        options: ['In a concrete cell', 'In the shadows, near the water hole', 'Behind bars', 'In a cage'],
        correctAnswer: 1,
        explanation: 'The poet Leslie Norris highlights that the wild tiger should lurk in the tall grass near the water hole to hunt deer.'
      },
      {
        id: 8,
        question: 'Choose the correctly spelled word:',
        options: ['Accomodation', 'Accommodation', 'Acommodation', 'Accommodatoin'],
        correctAnswer: 1,
        explanation: 'Accommodation has double "c" and double "m".'
      },
      {
        id: 9,
        question: 'Select the antonym of "Transient":',
        options: ['Temporary', 'Fleeting', 'Permanent', 'Brief'],
        correctAnswer: 2,
        explanation: 'Transient means lasting only for a short time; its opposite is permanent.'
      },
      {
        id: 10,
        question: 'Which literary device is used in "slid in silence"?',
        options: ['Metaphor', 'Alliteration', 'Simile', 'Hyperbole'],
        correctAnswer: 1,
        explanation: 'Repetition of the initial "s" consonant sound is Alliteration.'
      }
    ]
  },
  {
    id: 'test-12-grand-mock-1',
    title: 'Class 12 JAC Board Pre-Board Full Mock Test',
    class: '12',
    type: 'Board Mock',
    totalQuestions: 10,
    marks: 50,
    durationMinutes: 20,
    date: 'Active Now',
    status: 'Active',
    questions: [
      {
        id: 1,
        question: 'In "The Last Lesson", what was Franz expected to be prepared with for school?',
        options: ['Tenses', 'Participles', 'Poetry', 'Writing essay'],
        correctAnswer: 1,
        explanation: 'M. Hamel had announced he would question them on Participles.'
      },
      {
        id: 2,
        question: 'What does the title "Lost Spring" symbolize?',
        options: ['Loss of natural season', 'Loss of innocent childhood of poor children', 'Loss of spring flowers', 'Loss of youth'],
        correctAnswer: 1,
        explanation: 'Anees Jung uses "Spring" as a metaphor for childhood lost to poverty and child labor.'
      },
      {
        id: 3,
        question: 'Identify the error: "Neither Franz nor his friends was aware of the news."',
        options: ['Neither', 'nor', 'was', 'No error'],
        correctAnswer: 2,
        explanation: 'When subjects are joined by "neither... nor", verb agrees with closer subject. "his friends" is plural, so it should be "were".'
      },
      {
        id: 4,
        question: 'In "Deep Water", where did Douglas decide to learn swimming safely?',
        options: ['Yakima River', 'YMCA Pool in Yakima', 'Lake Wentworth', 'Columbia River'],
        correctAnswer: 1,
        explanation: 'The YMCA pool was safe, shallow at one end and gradual slope.'
      },
      {
        id: 5,
        question: 'What is the poet\'s mother compared to in "My Mother at Sixty-six"?',
        options: ['Bright summer sun', 'Late winter\'s moon', 'Fresh spring flower', 'Autumn leaf'],
        correctAnswer: 1,
        explanation: 'Kamala Das compares her pale, wan mother to a late winter\'s moon.'
      },
      {
        id: 6,
        question: 'Which tone dominates the end of "Keeping Quiet"?',
        options: ['Pessimistic', 'Quiet introspective hope', 'Angry', 'Indifferent'],
        correctAnswer: 1,
        explanation: 'Pablo Neruda emphasizes stillness, mutual understanding, and universal brotherhood.'
      },
      {
        id: 7,
        question: 'Correct format item for Formal Notice:',
        options: ['Receiver Address', 'Name of Institution / Organisation on top', 'Salutation', 'Subject line compulsory below signature'],
        correctAnswer: 1,
        explanation: 'A notice begins with the issuing authority/institution name in bold centered at top.'
      },
      {
        id: 8,
        question: 'Meaning of the idiom "To burn the midnight oil":',
        options: ['Waste electricity', 'Study late into the night', 'Start a fire', 'Work carelessly'],
        correctAnswer: 1,
        explanation: 'It means to stay up late reading or working hard.'
      },
      {
        id: 9,
        question: 'In "The Rattrap", what peddler belief compares the world to?',
        options: ['A big stage', 'A giant rattrap', 'A market', 'A golden cage'],
        correctAnswer: 1,
        explanation: 'The peddler believed the whole world was a big rattrap offering riches and joy as bait.'
      },
      {
        id: 10,
        question: 'Antonym of "Melancholy":',
        options: ['Sadness', 'Joyful', 'Gloom', 'Despair'],
        correctAnswer: 1,
        explanation: 'Melancholy means sadness; joyful is its exact antonym.'
      }
    ]
  },
  {
    id: 'test-11-weekly-2',
    title: 'Class 11 Hornbill & Advanced Grammar Test Set B',
    class: '11',
    type: 'Weekly OMR',
    totalQuestions: 10,
    marks: 40,
    durationMinutes: 15,
    date: 'Upcoming (Starts Sun 10:00 AM)',
    status: 'Upcoming'
  },
  {
    id: 'test-9-monthly-1',
    title: 'Class 9 Beehive Literature & Basic Syntax Quiz',
    class: '9',
    type: 'Monthly Grand',
    totalQuestions: 10,
    marks: 40,
    durationMinutes: 15,
    date: 'Completed',
    status: 'Completed'
  }
];
