/* =========================================================
   TIMELINE DATA — ডাঃ মোঃ রবিউল ইসলাম (রনি)
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
        title: "জন্ম",
        description: "জামালপুর জেলার সেতুভূষা গ্রামে জন্মগ্রহণ করেন।",
        image: "",
        estimated: false
    },
    {
        year: 2005,
        type: "education",
        title: "এসএসসি পাস",
        description: "জামালপুর জিলা স্কুল থেকে এসএসসি পরীক্ষায় উত্তীর্ণ হন।",
        image: "",
        estimated: false
    },
    {
        year: 2007,
        type: "education",
        title: "এইচএসসি পাস",
        description: "সরকারি আশেক মাহমুদ কলেজ থেকে এইচএসসি সম্পন্ন করেন।",
        image: "",
        estimated: false
    },
    {
        year: 2013,
        type: "education",
        title: "এমবিবিএস (MBBS) সম্পন্ন",
        description: "রাজশাহী বিশ্ববিদ্যালয়ের অধীনে খাজা ইউনুস আলী মেডিকেল কলেজ থেকে এমবিবিএস ডিগ্রি সম্পন্ন করেন।",
        image: "",
        estimated: true
    },
    {
        year: 2014,
        type: "career",
        title: "মেডিকেল অফিসার হিসেবে যোগদান",
        description: "অর্থোপেডিক্স (হাড়-জোড়া) বিভাগে মেডিকেল অফিসার হিসেবে কর্মজীবন শুরু করেন।",
        image: "",
        estimated: true
    },
    {
        year: 2015,
        type: "education",
        title: "উচ্চতর শিক্ষা শুরু — নাক-কান-গলা",
        description: "নাক-কান-গলা (ইএনটি) বিষয়ে উচ্চতর শিক্ষার জন্য স্যার সলিমুল্লাহ মেডিকেল কলেজে ভর্তি হন।",
        image: "",
        estimated: true
    },
    {
        year: 2017,
        type: "career",
        title: "রেজিস্ট্রার হিসেবে যোগদান",
        description: "কুমুদিনী উইমেন’স মেডিকেল কলেজ, টাঙ্গাইলে রেজিস্ট্রার হিসেবে যোগদান করেন।",
        image: "",
        estimated: false
    },
    {
        year: 2019,
        type: "career",
        title: "ইএনটি স্পেশালিস্ট হিসেবে যোগদান",
        description: "খাজা ইউনুস আলী মেডিকেল কলেজে নাক-কান-গলা বিশেষজ্ঞ হিসেবে যোগদান করেন।",
        image: "",
        estimated: false
    },
    {
        year: 2021,
        type: "career",
        title: "সহকারী অধ্যাপক হিসেবে যোগদান",
        description: "কুমুদিনী উইমেন’স মেডিকেল কলেজ, টাঙ্গাইলে সহকারী অধ্যাপক হিসেবে পুনরায় যোগদান করেন।",
        image: "",
        estimated: false
    }
];
