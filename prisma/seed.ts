import { PrismaClient, CollegeType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.examCutoff.deleteMany();
  await prisma.college.deleteMany();

  const colleges = [
    {
      slug: "iit-bombay",
      name: "Indian Institute of Technology Bombay",
      city: "Mumbai",
      state: "Maharashtra",
      type: CollegeType.GOVERNMENT,
      feesPerYear: 250000,
      rating: 4.8,
      establishedYear: 1958,
      description: "Premier engineering institute known for CSE and rigorous academics.",
    },
    {
      slug: "iit-delhi",
      name: "Indian Institute of Technology Delhi",
      city: "New Delhi",
      state: "Delhi",
      type: CollegeType.GOVERNMENT,
      feesPerYear: 240000,
      rating: 4.7,
      establishedYear: 1961,
      description: "Top-ranked IIT with strong placement record.",
    },
    {
      slug: "iit-madras",
      name: "Indian Institute of Technology Madras",
      city: "Chennai",
      state: "Tamil Nadu",
      type: CollegeType.GOVERNMENT,
      feesPerYear: 235000,
      rating: 4.8,
      establishedYear: 1959,
      description: "Top-ranked IIT, strong research output and startup ecosystem.",
    },
    {
      slug: "nit-trichy",
      name: "National Institute of Technology Tiruchirappalli",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      type: CollegeType.GOVERNMENT,
      feesPerYear: 180000,
      rating: 4.4,
      establishedYear: 1964,
      description: "Top NIT with strong core engineering and CSE placements.",
    },
    {
      slug: "nit-surathkal",
      name: "National Institute of Technology Karnataka, Surathkal",
      city: "Mangalore",
      state: "Karnataka",
      type: CollegeType.GOVERNMENT,
      feesPerYear: 175000,
      rating: 4.3,
      establishedYear: 1960,
      description: "Coastal campus NIT known for CSE and ECE programs.",
    },
    {
      slug: "bits-pilani",
      name: "BITS Pilani",
      city: "Pilani",
      state: "Rajasthan",
      type: CollegeType.PRIVATE,
      feesPerYear: 480000,
      rating: 4.5,
      establishedYear: 1964,
      description: "Top private engineering institute, no entrance reservation system.",
    },
    {
      slug: "vit-vellore",
      name: "VIT Vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      type: CollegeType.PRIVATE,
      feesPerYear: 220000,
      rating: 4.1,
      establishedYear: 1984,
      description: "Large private deemed-to-be university, strong placements in IT.",
    },
    {
      slug: "srm-chennai",
      name: "SRM Institute of Science and Technology",
      city: "Chennai",
      state: "Tamil Nadu",
      type: CollegeType.PRIVATE,
      feesPerYear: 285000,
      rating: 3.8,
      establishedYear: 1985,
      description: "Large private university with wide range of engineering programs.",
    },
    {
      slug: "manipal-institute-of-technology",
      name: "Manipal Institute of Technology",
      city: "Manipal",
      state: "Karnataka",
      type: CollegeType.DEEMED,
      feesPerYear: 450000,
      rating: 3.9,
      establishedYear: 1957,
      description: "Deemed university with diverse engineering programs.",
    },
    {
      slug: "amrita-coimbatore",
      name: "Amrita Vishwa Vidyapeetham, Coimbatore",
      city: "Coimbatore",
      state: "Tamil Nadu",
      type: CollegeType.DEEMED,
      feesPerYear: 320000,
      rating: 4.0,
      establishedYear: 1994,
      description: "Deemed university with strong CSE and biotech programs.",
    },
    {
      slug: "jadavpur-university",
      name: "Jadavpur University",
      city: "Kolkata",
      state: "West Bengal",
      type: CollegeType.GOVERNMENT,
      feesPerYear: 25000,
      rating: 4.2,
      establishedYear: 1955,
      description: "Highly affordable government university with strong engineering legacy.",
    },
    {
      slug: "thapar-institute",
      name: "Thapar Institute of Engineering and Technology",
      city: "Patiala",
      state: "Punjab",
      type: CollegeType.DEEMED,
      feesPerYear: 380000,
      rating: 4.0,
      establishedYear: 1956,
      description: "Well-regarded deemed university in North India for engineering.",
    },
  ];

  for (const c of colleges) {
    await prisma.college.create({ data: c });
  }

  const all = await prisma.college.findMany();
  const byId = (slug: string) => all.find((c) => c.slug === slug)!;

  const courseData = [
    { college: "iit-bombay", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 250000, seats: 120 },
    { college: "iit-bombay", name: "Mechanical Engineering", durationYears: 4, feesPerYear: 230000, seats: 100 },
    { college: "iit-delhi", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 240000, seats: 110 },
    { college: "iit-delhi", name: "Electrical Engineering", durationYears: 4, feesPerYear: 235000, seats: 95 },
    { college: "iit-madras", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 235000, seats: 115 },
    { college: "iit-madras", name: "Aerospace Engineering", durationYears: 4, feesPerYear: 225000, seats: 60 },
    { college: "nit-trichy", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 180000, seats: 130 },
    { college: "nit-trichy", name: "Civil Engineering", durationYears: 4, feesPerYear: 165000, seats: 90 },
    { college: "nit-surathkal", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 175000, seats: 125 },
    { college: "nit-surathkal", name: "Electronics & Communication", durationYears: 4, feesPerYear: 170000, seats: 100 },
    { college: "bits-pilani", name: "Computer Science", durationYears: 4, feesPerYear: 480000, seats: 200 },
    { college: "bits-pilani", name: "Electronics & Instrumentation", durationYears: 4, feesPerYear: 460000, seats: 90 },
    { college: "vit-vellore", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 220000, seats: 600 },
    { college: "vit-vellore", name: "Information Technology", durationYears: 4, feesPerYear: 210000, seats: 300 },
    { college: "srm-chennai", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 285000, seats: 500 },
    { college: "srm-chennai", name: "Biotechnology", durationYears: 4, feesPerYear: 240000, seats: 120 },
    { college: "manipal-institute-of-technology", name: "Information Technology", durationYears: 4, feesPerYear: 450000, seats: 180 },
    { college: "manipal-institute-of-technology", name: "Mechanical Engineering", durationYears: 4, feesPerYear: 420000, seats: 150 },
    { college: "amrita-coimbatore", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 320000, seats: 240 },
    { college: "amrita-coimbatore", name: "Biotechnology", durationYears: 4, feesPerYear: 280000, seats: 80 },
    { college: "jadavpur-university", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 25000, seats: 60 },
    { college: "jadavpur-university", name: "Electrical Engineering", durationYears: 4, feesPerYear: 22000, seats: 55 },
    { college: "thapar-institute", name: "Computer Science & Engineering", durationYears: 4, feesPerYear: 380000, seats: 240 },
    { college: "thapar-institute", name: "Mechanical Engineering", durationYears: 4, feesPerYear: 350000, seats: 120 },
  ];
  for (const cd of courseData) {
    const college = byId(cd.college);
    await prisma.course.create({
      data: {
        collegeId: college.id,
        name: cd.name,
        durationYears: cd.durationYears,
        feesPerYear: cd.feesPerYear,
        seats: cd.seats,
      },
    });
  }

  const placementData = [
    { college: "iit-bombay", year: 2024, avgPackage: 2400000, medianPackage: 2000000, highestPackage: 12000000, placementPercent: 98 },
    { college: "iit-bombay", year: 2023, avgPackage: 2200000, medianPackage: 1900000, highestPackage: 11000000, placementPercent: 97 },
    { college: "iit-delhi", year: 2024, avgPackage: 2500000, medianPackage: 2100000, highestPackage: 13000000, placementPercent: 96 },
    { college: "iit-delhi", year: 2023, avgPackage: 2300000, medianPackage: 1950000, highestPackage: 12500000, placementPercent: 95 },
    { college: "iit-madras", year: 2024, avgPackage: 2450000, medianPackage: 2050000, highestPackage: 13500000, placementPercent: 97 },
    { college: "iit-madras", year: 2023, avgPackage: 2250000, medianPackage: 1900000, highestPackage: 12000000, placementPercent: 96 },
    { college: "nit-trichy", year: 2024, avgPackage: 1500000, medianPackage: 1200000, highestPackage: 8000000, placementPercent: 92 },
    { college: "nit-trichy", year: 2023, avgPackage: 1400000, medianPackage: 1100000, highestPackage: 7500000, placementPercent: 90 },
    { college: "nit-surathkal", year: 2024, avgPackage: 1450000, medianPackage: 1150000, highestPackage: 7800000, placementPercent: 91 },
    { college: "nit-surathkal", year: 2023, avgPackage: 1350000, medianPackage: 1050000, highestPackage: 7000000, placementPercent: 89 },
    { college: "bits-pilani", year: 2024, avgPackage: 2100000, medianPackage: 1800000, highestPackage: 9000000, placementPercent: 94 },
    { college: "bits-pilani", year: 2023, avgPackage: 2000000, medianPackage: 1700000, highestPackage: 8700000, placementPercent: 93 },
    { college: "vit-vellore", year: 2024, avgPackage: 800000, medianPackage: 650000, highestPackage: 5000000, placementPercent: 85 },
    { college: "vit-vellore", year: 2023, avgPackage: 750000, medianPackage: 620000, highestPackage: 4500000, placementPercent: 83 },
    { college: "srm-chennai", year: 2024, avgPackage: 700000, medianPackage: 550000, highestPackage: 4200000, placementPercent: 78 },
    { college: "srm-chennai", year: 2023, avgPackage: 680000, medianPackage: 530000, highestPackage: 4000000, placementPercent: 76 },
    { college: "manipal-institute-of-technology", year: 2024, avgPackage: 0, medianPackage: 0, highestPackage: 0, placementPercent: 0 },
    { college: "manipal-institute-of-technology", year: 2023, avgPackage: 620000, medianPackage: 500000, highestPackage: 3800000, placementPercent: 80 },
    { college: "amrita-coimbatore", year: 2024, avgPackage: 750000, medianPackage: 600000, highestPackage: 4400000, placementPercent: 82 },
    { college: "jadavpur-university", year: 2024, avgPackage: 1100000, medianPackage: 900000, highestPackage: 6000000, placementPercent: 88 },
    { college: "thapar-institute", year: 2024, avgPackage: 950000, medianPackage: 780000, highestPackage: 5500000, placementPercent: 86 },
  ];
  for (const pd of placementData) {
    const college = byId(pd.college);
    await prisma.placement.create({
      data: {
        collegeId: college.id,
        year: pd.year,
        avgPackage: pd.avgPackage,
        medianPackage: pd.medianPackage,
        highestPackage: pd.highestPackage,
        placementPercent: pd.placementPercent,
      },
    });
  }

  const reviewData = [
    { college: "iit-bombay", rating: 5, title: "Best decision of my life", body: "Incredible peer group and faculty.", authorName: "Aarav S." },
    { college: "iit-bombay", rating: 4, title: "Tough but rewarding", body: "Academic pressure is real but worth it.", authorName: "Diya M." },
    { college: "iit-delhi", rating: 5, title: "Outstanding research exposure", body: "Faculty actively involve undergrads in research.", authorName: "Karan V." },
    { college: "iit-madras", rating: 5, title: "Best campus in the country", body: "Green campus, great hostel life, strong alumni network.", authorName: "Sneha R." },
    { college: "nit-trichy", rating: 4, title: "Solid core branches", body: "Civil and mechanical departments are underrated.", authorName: "Vikram T." },
    { college: "bits-pilani", rating: 4, title: "Flexible curriculum", body: "Dual degree and minor options are a huge plus.", authorName: "Priya N." },
    { college: "vit-vellore", rating: 4, title: "Great for IT placements", body: "Huge campus, strong industry connect.", authorName: "Rohan K." },
    { college: "vit-vellore", rating: 3, title: "Overcrowded classes", body: "Batch sizes are too large for personalized attention.", authorName: "Ishaan P." },
    { college: "srm-chennai", rating: 3, title: "Decent but inconsistent", body: "Some departments are excellent, others lag behind.", authorName: "Meera J." },
    { college: "manipal-institute-of-technology", rating: 4, title: "Great campus life", body: "Vibrant social life and good infrastructure.", authorName: "Arjun B." },
    { college: "jadavpur-university", rating: 5, title: "Unbeatable value", body: "World-class education at government fees.", authorName: "Souvik D." },
    { college: "thapar-institute", rating: 4, title: "Strong industry tie-ups", body: "Good placement cell and internship support.", authorName: "Gurpreet S." },
  ];
  for (const rd of reviewData) {
    const college = byId(rd.college);
    await prisma.review.create({
      data: {
        collegeId: college.id,
        rating: rd.rating,
        title: rd.title,
        body: rd.body,
        authorName: rd.authorName,
      },
    });
  }

  const cutoffData = [
    { college: "iit-bombay", examName: "JEE Advanced", category: "General", year: 2024, cutoffRank: 70 },
    { college: "iit-bombay", examName: "JEE Advanced", category: "OBC", year: 2024, cutoffRank: 250 },
    { college: "iit-bombay", examName: "JEE Advanced", category: "SC", year: 2024, cutoffRank: 600 },
    { college: "iit-delhi", examName: "JEE Advanced", category: "General", year: 2024, cutoffRank: 120 },
    { college: "iit-delhi", examName: "JEE Advanced", category: "OBC", year: 2024, cutoffRank: 400 },
    { college: "iit-madras", examName: "JEE Advanced", category: "General", year: 2024, cutoffRank: 200 },
    { college: "iit-madras", examName: "JEE Advanced", category: "OBC", year: 2024, cutoffRank: 550 },
    { college: "nit-trichy", examName: "JEE Main", category: "General", year: 2024, cutoffRank: 3500 },
    { college: "nit-trichy", examName: "JEE Main", category: "OBC", year: 2024, cutoffRank: 7000 },
    { college: "nit-surathkal", examName: "JEE Main", category: "General", year: 2024, cutoffRank: 4200 },
    { college: "nit-surathkal", examName: "JEE Main", category: "OBC", year: 2024, cutoffRank: 8200 },
    { college: "bits-pilani", examName: "BITSAT", category: "General", year: 2024, cutoffRank: 320 },
    { college: "vit-vellore", examName: "VITEEE", category: "General", year: 2024, cutoffRank: 8500 },
    { college: "vit-vellore", examName: "VITEEE", category: "OBC", year: 2024, cutoffRank: 15000 },
    { college: "srm-chennai", examName: "SRMJEEE", category: "General", year: 2024, cutoffRank: 12000 },
    { college: "manipal-institute-of-technology", examName: "MET", category: "General", year: 2024, cutoffRank: 6000 },
    { college: "amrita-coimbatore", examName: "AEEE", category: "General", year: 2024, cutoffRank: 5000 },
    { college: "jadavpur-university", examName: "WBJEE", category: "General", year: 2024, cutoffRank: 800 },
    { college: "jadavpur-university", examName: "WBJEE", category: "OBC", year: 2024, cutoffRank: 1600 },
    { college: "thapar-institute", examName: "JEE Main", category: "General", year: 2024, cutoffRank: 18000 },
  ];
  for (const cd of cutoffData) {
    const college = byId(cd.college);
    await prisma.examCutoff.create({
      data: {
        collegeId: college.id,
        examName: cd.examName,
        category: cd.category,
        year: cd.year,
        cutoffRank: cd.cutoffRank,
      },
    });
  }

  console.log(`Seeded ${all.length} colleges with courses, placements, reviews, and exam cutoffs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
