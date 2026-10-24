const snippets = {
    algorithms: [
        "python",
        "def search(lo, hi, ok):\n    while lo < hi:\n        mid = (lo + hi) // 2\n        lo, hi = (lo, mid) if ok(mid) else (mid + 1, hi)\n    return lo",
    ],
    hardware: [
        "cpp",
        "void loop() {\n  int level = analogRead(A0);\n  analogWrite(LED_PIN, map(level, 0, 1023, 255, 0));\n  delay(50);\n}",
    ],
    "3d-printing": [
        "gcode",
        "G28 ; home all axes\nM104 S210 ; nozzle temp\nG1 Z0.2 F3000\nG1 X120 E15 F1500",
    ],
    devops: [
        "yaml",
        'services:\n  mongo:\n    image: mongo:7\n    ports:\n      - "27017:27017"',
    ],
    tools: [
        "bash",
        'ollama pull mistral\nollama run mistral "Summarise this file"',
    ],
    default: [
        "typescript",
        'export async function getPosts() {\n    const response = await fetch(apiUrl("/posts"));\n    return response.json();\n}',
    ],
};

const fence = "```";

export function blogMarkdown(blog, [firstFigure, secondFigure]) {
    const [language, code] =
        snippets[blog.tags.find((tag) => snippets[tag])] ?? snippets.default;
    return `${blog.heading} started as a weekend experiment and turned into something worth writing up. This post walks through the problem, the approach and what I would change next time.

## Background

The goal was simple: get something working end to end, then make it pleasant to maintain. Most of the effort went into the boring parts, which is usually where the real lessons are.

![${blog.heading} overview](${firstFigure})

## Approach

- Start with the smallest version that proves the idea.
- Measure before optimising anything.
- Write down every surprise, because those become the next post.

<note>This is seeded placeholder content for local development.</note>

${fence}${language}
${code}
${fence}

## Results

| Metric | Before | After |
| ------ | ------ | ----- |
| Setup time | 2 hours | 10 minutes |
| Failures per week | 4 | 0 |

![${blog.heading} results](${secondFigure})

<warn>Numbers above are made up for testing the table renderer.</warn>

## Wrap-up

Small, steady iterations beat a big rewrite. Next up: tidying the rough edges and sharing the source.
`;
}
