/* =========================================================
   TIMELINE DATA — Dr. Md. Robiul Islam (Rony)
   ---------------------------------------------------------
   Fields:
   year        - number, used for sorting (oldest first)
   type        - "birth" | "education" | "career" | "present"
                 (controls which icon shows on the dot)
   title       - short heading
   description - 1-3 sentences
   image       - optional path to an image, "" if none
   estimated   - true if the year is a placeholder estimate
                 that still needs confirmation from the client
   ========================================================= */

const timelineData = [
    {
        year: 1988,
        type: "birth",
        title: "Birth",
        description: "Born in Shitol Kursha village, Jamalpur district.",
        image: "",
        estimated: false
    },
    {
        year: 2005,
        type: "education",
        title: "Passed SSC",
        description: "Passed the SSC examination from Jamalpur Zilla School.",
        image: "",
        estimated: false
    },
    {
        year: 2007,
        type: "education",
        title: "Passed HSC",
        description: "Completed HSC from Government Ashek Mahmud College.",
        image: "",
        estimated: false
    },
    {
        year: 2013,
        type: "education",
        title: "Completed MBBS",
        description: "Completed MBBS degree from Khwaja Yunus Ali Medical College, under Rajshahi University.",
        image: "",
        estimated: true
    },
    {
        year: 2014,
        type: "career",
        title: "Joined as Medical Officer",
        description: "Began his career as a Medical Officer in the Orthopedics department.",
        image: "",
        estimated: true
    },
    {
        year: 2015,
        type: "education",
        title: "Began Higher Studies — ENT",
        description: "Enrolled at Sir Salimullah Medical College for higher studies in ENT (Ear, Nose & Throat).",
        image: "",
        estimated: true
    },
    {
        year: 2017,
        type: "career",
        title: "Joined as Registrar",
        description: "Joined as Registrar at Kumudini Women's Medical College, Tangail.",
        image: "",
        estimated: false
    },
    {
        year: 2019,
        type: "career",
        title: "Joined as ENT Specialist",
        description: "Joined Khwaja Yunus Ali Medical College as an ENT Specialist.",
        image: "",
        estimated: false
    },
    {
        year: 2021,
        type: "career",
        title: "Joined as Assistant Professor",
        description: "Rejoined Kumudini Women's Medical College, Tangail, as Assistant Professor.",
        image: "",
        estimated: false
    }
];
