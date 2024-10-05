export const getLessonsResponse = [
  {
    id: 1,
    title: "Functions",
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("Hello, World!"); return 0; }',
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
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("Hello, Data Structures!"); return 0; }',
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
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("Hello, Data Structures!"); return 0; }',
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
    files: [
      {
        name: "main.c",
        path: "hello.c",
        content:
          '#include <stdio.h>\nint main() { printf("Hello, Data Structures!"); return 0; }',
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
