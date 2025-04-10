export const getLessonsResponse = [
  {
    id: 1,
    title: "Functions",
    deadline: "2025-04-15T23:59:00Z",
    points: 4,
    comment:
      "Good effort on this assignment. You’ve done a nice job implementing the basics, but consider optimizing your code for readability by adding more comments. \
       Also, watch out for memory leaks when working with dynamic data structures like linked lists; \
        adding free() calls for allocated memory at the end of your functions would be a good practice.",
    status: "COMPLETED",
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("FIRST LESSON!"); return 0; }',
      },
      {
        name: "Makefile",
        path: "Makefile",
        content: "all: hello\nhello:\n\tgcc hello.c -o hello",
      },
      {
        name: "test.sh",
        path: ".test/firstTest/test.sh",
        content: "#!/bin/bash\necho First Test",
      },
      { name: "rc", path: ".test/firstTest/rc", content: "exit 0" },
      {
        name: "test.sh",
        path: ".test/secondTest/test.sh",
        content: "#!/bin/bash\necho Second Test",
      },
      { name: "rc", path: ".test/secondTest/rc", content: "exit 0" },
    ],
  },
  {
    id: 2,
    title: "Data-structures",
    deadline: "2025-04-15T23:59:00Z",
    points: 2,
    comment:
      "Good effort on this assignment. You’ve done a nice job implementing the basics, but consider optimizing your code for readability by adding more comments. \
       Also, watch out for memory leaks when working with dynamic data structures like linked lists; \
        adding free() calls for allocated memory at the end of your functions would be a good practice.",
    status: "COMPLETED",
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("SECOND LESSON!"); return 0; }',
      },
      {
        name: "Makefile",
        path: "Makefile",
        content: "all: hello\nhello:\n\tgcc hello.c -o hello",
      },
      {
        name: "test.sh",
        path: ".test/firstTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 1",
      },
      { name: "rc", path: ".test/firstTest/rc", content: "exit 0" },
      {
        name: "test.sh",
        path: ".test/secondTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 2",
      },
      { name: "rc", path: ".test/secondTest/rc", content: "exit 0" },
    ],
  },
  {
    id: 3,
    title: "Pointers-and-memory",
    deadline: "2025-01-01T23:59:00Z",
    points: null,
    comment: null,
    status: "SUBMITTED",
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("SECOND LESSON!"); return 0; }',
      },
      {
        name: "Makefile",
        path: "Makefile",
        content: "all: hello\nhello:\n\tgcc hello.c -o hello",
      },
      {
        name: "test.sh",
        path: ".test/firstTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 1",
      },
      { name: "rc", path: ".test/firstTest/rc", content: "exit 0" },
      {
        name: "test.sh",
        path: ".test/secondTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 2",
      },
      { name: "rc", path: ".test/secondTest/rc", content: "exit 0" },
    ],
  },
  {
    id: 4,
    title: "Algorithms",
    deadline: "2025-04-15T23:59:00Z",
    points: null,
    comment: null,
    status: "IN_PROGRESS",
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("SECOND LESSON!"); return 0; }',
      },
      {
        name: "Makefile",
        path: "Makefile",
        content: "all: hello\nhello:\n\tgcc hello.c -o hello",
      },
      {
        name: "test.sh",
        path: ".test/firstTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 1",
      },
      { name: "rc", path: ".test/firstTest/rc", content: "exit 0" },
      {
        name: "test.sh",
        path: ".test/secondTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 2",
      },
      { name: "rc", path: ".test/secondTest/rc", content: "exit 0" },
    ],
  },
  {
    id: 5,
    title: "Recursion",
    deadline: "2025-04-15T23:59:00Z",
    points: null,
    comment: null,
    status: "TO_DO",
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("FOURTH LESSON!"); return 0; }',
      },
      {
        name: "Makefile",
        path: "Makefile",
        content: "all: hello\nhello:\n\tgcc hello.c -o hello",
      },
      {
        name: "test.sh",
        path: ".test/firstTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 1",
      },
      { name: "rc", path: ".test/firstTest/rc", content: "exit 0" },
      {
        name: "test.sh",
        path: ".test/secondTest/test.sh",
        content: "#!/bin/bash\necho Data Structure Test 2",
      },
      { name: "rc", path: ".test/secondTest/rc", content: "exit 0" },
    ],
  },
];
