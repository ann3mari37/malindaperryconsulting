/* =============================================================
   SITE DATA — the one file to edit for day-to-day updates.
   Used by malindaperryconsulting.com (index.html).
   The link library on admin. is edited in the browser, not here.

   Anything marked TODO is placeholder content. Replace it
   before launch.
   ============================================================= */
window.SITE = {
  name: "MaLinda Perry",
  business: "MaLinda Perry Consulting",

  // TODO: confirm the inbox. The old site used this address.
  email: "hello@malindaperry.com",

  // Scheduling link (Calendly, Acuity, TidyCal, Google booking page...).
  // Leave empty "" and every "Book" button scrolls to the contact form instead.
  scheduleUrl: "", // TODO

  // Optional: where people join your email list (BookFunnel, MailerLite, etc.)
  newsletterUrl: "", // TODO

  social: {
    linkedin: "",  // TODO e.g. "https://www.linkedin.com/in/..."
    instagram: "", // TODO
    facebook: ""   // TODO
  },

  /* -----------------------------------------------------------
     BOOKS
     buy: a list of buttons. Today that's BookFunnel for ebooks.
     Later, add IngramSpark / Shopify links for print, e.g.
       { label: "Buy the paperback", url: "https://shop.../products/..." }
     The first link is the main (orange) button.
     cover: path to an image (e.g. "images/books/book-1.jpg").
     Leave cover "" and a clean typographic cover is drawn instead.
     ----------------------------------------------------------- */
  books: [
    {
      title: "UNSTUCK",
      subtitle: "Your Personal Journey From Stuck to Possibility",
      cover: "",   // TODO: add the real cover, e.g. "images/books/unstuck.jpg"
      format: "A companion workbook",
      blurb: "This isn't another assignment for your overflowing to-do list. This is time for YOU: to see who you are, own what makes you extraordinary, and live it.",
      details: [
        "Time to think about who you are, what makes you extraordinary, and what might be possible if you stopped carrying around some of those rocks you've collected along the way.",
        "You don't need to have all the answers. You don't need to know exactly where you're going. And you certainly don't need to become somebody else.",
        "Grab your favorite beverage, find a comfortable spot, and let's go find your magic. See it. Own it. Live it."
      ],
      buy: [
        { label: "Get the workbook", url: "" } // TODO BookFunnel link
      ]
    }
  ],

  /* -----------------------------------------------------------
     EVENTS
     date: "YYYY-MM-DD". Past events hide automatically.
     registerUrl: Eventbrite, Zoom registration, etc.
     Leave registerUrl "" and "Save my seat" opens the contact form.
     ----------------------------------------------------------- */
  events: [
    {
      title: "Strengths at Work: An Intro Workshop", // TODO
      date: "2026-12-04",
      time: "12:00 – 1:00 pm CT",
      location: "Online (Zoom)",
      summary: "A one-hour introduction to CliftonStrengths and how to use your top five on purpose.", // TODO
      details: [
        "Full event description goes here: who it's for, what to bring, and what you'll leave with."
      ], // TODO
      price: "Free",
      registerUrl: "" // TODO
    },
    {
      title: "Family Strengths Night",        // TODO
      date: "2027-01-15",
      time: "6:30 – 8:00 pm CT",
      location: "Location TBA",
      summary: "An evening for families to learn each other's strengths and how to work with them at home.", // TODO
      details: [
        "Full event description goes here."
      ],
      price: "$25 per family",
      registerUrl: ""
    }
  ]
};
