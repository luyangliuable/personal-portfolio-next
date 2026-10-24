// Fake blog posts for local testing. The first five keep the ids the seed has
// always used; the rest get stable ids derived from their slug.
const legacy = [
    [
        "658180006c73ceb16ba51732",
        "Rebuilding My Portfolio Backend in Next.js",
        ["projects", "nextjs"],
        { featured: true },
    ],
    [
        "658180016c73ceb16ba51733",
        "Binary Search Beyond Sorted Arrays",
        ["algorithms", "leetcode"],
        { featured: true },
    ],
    [
        "658180026c73ceb16ba51734",
        "Designing a 3D Printed Swivel Arm",
        ["3d-printing", "projects"],
    ],
    [
        "66ab67bd8803e8c20005c32e",
        "Building a Local Chatbot with Mistral",
        ["tools", "ai"],
    ],
    [
        "66e588c918eb5f86ea13b531",
        "What Two Years in Fintech Taught Me",
        ["experience"],
    ],
];

const fresh = [
    [
        "Arduino RGB Controller from Scratch",
        ["hardware", "arduino"],
        { featured: true },
    ],
    ["Sliding Window Patterns for Interviews", ["algorithms", "leetcode"]],
    [
        "Emacs Lite: A Minimal Config That Sticks",
        ["tools", "emacs"],
        { inProgress: true },
    ],
    ["Docker Compose for Local Full-Stack Dev", ["devops", "tools"]],
    ["A Light Sensor Night Lamp", ["hardware"]],
    [
        "Printing Flexible Joints Without Supports",
        ["3d-printing"],
        { inProgress: true },
    ],
    [
        "Fractal Hills with WebGPU",
        ["web-experiments", "graphics"],
        { featured: true },
    ],
    ["Notes on Writing Useful Unit Tests", ["testing"]],
];

export function slugify(heading) {
    return heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export const blogs = [
    ...legacy.map(([id, heading, tags, flags = {}]) => ({
        id,
        heading,
        tags,
        ...flags,
    })),
    ...fresh.map(([heading, tags, flags = {}]) => ({
        id: null,
        heading,
        tags,
        ...flags,
    })),
].map((blog, index) => ({
    ...blog,
    slug: slugify(blog.heading),
    featured: blog.featured ?? false,
    inProgress: blog.inProgress ?? false,
    // Spread posts over the past year so date sorting has something to do.
    date: new Date(Date.UTC(2026, 9 - index, 20 - index)),
    minutes: 3 + (index % 6),
}));
