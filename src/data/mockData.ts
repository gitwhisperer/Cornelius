// Mock Data for Smart Lecture Notes Application

import type { User, Batch, Subject, Lecture, Assignment, Exam, ChatMessage, TimetableEntry } from '../types';

export const mockSubjects: Subject[] = [
  { id: 'sub-dsa', name: 'Data Structures & Algorithms', code: 'CS301', color: '#2196F3', teacher: 'Dr. Sarah Johnson' },
  { id: 'sub-ml', name: 'Machine Learning', code: 'CS405', color: '#4CAF50', teacher: 'Prof. David Chen' },
  { id: 'sub-dbms', name: 'Database Systems', code: 'CS302', color: '#9C27B0', teacher: 'Dr. Emily Rodriguez' },
  { id: 'sub-os', name: 'Operating Systems', code: 'CS301', color: '#FF9800', teacher: 'Dr. Robert Lee' },
  { id: 'sub-networks', name: 'Computer Networks', code: 'CS401', color: '#009688', teacher: 'Dr. Lisa Wang' },
];

export const mockTimetable: TimetableEntry[] = [
  {
    id: '1',
    subjectId: 'sub-dsa',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'LH-201',
    professor: 'Dr. Sarah Chen'
  },
  {
    id: '2',
    subjectId: 'sub-ml',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Lab 301',
    professor: 'Dr. James Wilson'
  },
  {
    id: '3',
    subjectId: 'sub-dbms',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Lab 3',
    professor: 'Dr. Chen'
  }
];

// Mock Lectures
export const mockLectures: Lecture[] = [
  {
    id: 'lec-001',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-dsa',
    title: 'Advanced Graph Algorithms: Dijkstra\'s and A* Search',
    date: '2026-01-09',
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    room: 'LH-301',
    professor: 'Dr. Sarah Chen',
    recordingDevices: 6,
    status: 'completed',
    isNew: true,
    isExamRelevant: true,
    summary: {
      quick: 'Today\'s lecture covered Dijkstra\'s algorithm and its applications in finding shortest paths. Professor emphasized the importance of priority queues and discussed time complexity analysis.',
      detailed: [
        'Introduction to graph algorithms and shortest path problems',
        'Dijkstra\'s algorithm implementation and complexity analysis',
        'Real-world applications in navigation and network routing',
        'Comparison with Bellman-Ford algorithm',
        'Practice problems and exam preparation tips'
      ],
      comprehensive: 'Comprehensive lecture on Dijkstra\'s shortest path algorithm...'
    },
    importantInfo: {
      assignments: [{
        title: 'Graph Algorithms Implementation',
        dueDate: '2026-01-15T23:59:00',
        requirements: [
          'Implement Dijkstra\'s algorithm in Python',
          'Include test cases with at least 5 different graphs',
          'Write analysis of time complexity',
          'Submit code + documentation'
        ],
        timestamp: '00:45:23'
      }],
      exams: [{
        type: 'Midterm',
        date: '2026-01-20',
        topics: ['Graph algorithms', 'Dynamic Programming', 'Trees'],
        timestamp: '01:45:30'
      }],
      resources: [
        { title: 'Cormen Chapter 15', url: '#', type: 'document' },
        { title: 'Visualization Tool', url: 'https://visualgo.net', type: 'link' }
      ]
    },
    codeSnippets: [
      {
        language: 'python',
        code: `def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        dist, node = heapq.heappop(pq)
        if dist > distances[node]:
            continue
        for neighbor, weight in graph[node]:
            distance = dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))`,
        timestamp: '00:45:30',
        description: 'Dijkstra\'s algorithm implementation'
      }
    ],
    qna: [
      {
        question: "Can we use a priority queue instead of sorting at each step?",
        answer: "Yes, that's actually the optimal approach. Using a min-heap reduces complexity from O(V²) to O(E log V).",
        timestamp: "00:42:15",
        student: "Priya Sharma"
      },
      {
        question: "Will this be asked in the midterm?",
        answer: "Yes, definitely practice Dijkstra's implementation. I'll ask one coding problem on shortest path algorithms.",
        timestamp: "00:51:20"
      }
    ],
    sections: [
      {
        title: "Introduction to Graph Algorithms",
        timestamp: "00:00:00",
        duration: 8,
        content: "We began by reviewing basic graph terminologies (vertices, edges, weights) and discussed why shortest path problems are critical in computer science. The professor used the example of Google Maps to explain nodes (intersections) and edges (roads with weights representing traffic/distance).",
        keyPoints: [
          "Graphs can represent networks, maps, social connections",
          "Weighted vs unweighted graphs significantly change the problem difficulty",
          "Dijkstra's algorithm guarantees shortest path in non-negative weighted graphs"
        ]
      },
      {
        title: "Dijkstra's Algorithm Implementation",
        timestamp: "00:08:15",
        duration: 25,
        content: "A detailed walkthrough of the greedy strategy used in Dijkstra's. We traced the algorithm on a sample graph with 6 nodes. The core idea is 'relaxation' - checking if we can find a shorter path to a neighbor through the current node. We maintain a 'visited' set and a priority queue of candidate nodes.",
        keyPoints: [
          "Uses priority queue (min-heap) for efficiency",
          "Time complexity: O((V+E)logV) with binary heap",
          "Cannot handle negative weights (Bellman-Ford is needed for that)"
        ]
      },
      {
        title: "Assignment Discussion",
        timestamp: "00:45:20",
        duration: 5,
        content: "Professor discusses Assignment 3 requirements. You need to implement the algorithm from scratch without using NetworkX or similar libraries. Focus on handling edge cases like disconnected graphs.",
        keyPoints: [
          "Due date: January 15th, 11:59 PM",
          "Implement Dijkstra's algorithm in Python/C++",
          "Test with at least 5 graph examples including edge cases"
        ]
      }
    ]
  },
  {
    id: 'lec-002',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-ml',
    title: 'Neural Networks: Backpropagation and Optimization',
    date: '2026-01-10',
    startTime: '11:00',
    endTime: '12:30',
    duration: 90,
    room: 'Lab 3',
    professor: 'Dr. James Wilson',
    recordingDevices: 7,
    status: 'completed',
    summary: {
      quick: 'Deep dive into backpropagation algorithm with step-by-step mathematical derivation. Covered gradient descent optimization techniques including momentum and Adam optimizer.',
      detailed: [
        'Mathematical foundations of backpropagation',
        'Chain rule application in neural networks',
        'Gradient descent variants and their trade-offs',
        'Practical implementation tips and common pitfalls'
      ],
      comprehensive: 'Complete lecture on backpropagation...'
    },
    importantInfo: {
      assignments: [{
        title: 'ML Assignment 2: Implement Neural Network from Scratch',
        dueDate: '2026-01-20T23:59:00',
        requirements: [
          'Implement backpropagation without using ML libraries',
          'Test on MNIST dataset',
          'Write detailed report on optimization techniques tested'
        ],
        timestamp: '01:15:30'
      }],
      resources: [{
        title: 'Stanford CS231n Backprop Notes',
        url: 'https://cs231n.github.io/optimization-2/',
        type: 'link'
      }]
    },
    sections: [
        {
            title: "The Chain Rule in Calculus",
            timestamp: "00:05:00",
            duration: 15,
            content: "Review of the chain rule from calculus which is the backbone of backpropagation. If y = f(u) and u = g(x), then dy/dx = dy/du * du/dx. In neural networks, we compute gradients of the loss function with respect to weights by propagating errors backward from the output layer.",
            keyPoints: ["Chain rule allows computing derivatives of composite functions", "Essential for finding gradients in multi-layer networks"]
        },
        {
            title: "Forward vs Backward Pass",
            timestamp: "00:25:00",
            duration: 20,
            content: "Forward pass computes the output and loss. Backward pass computes gradients. We store intermediate activations during forward pass to use them in backward pass (memory tradeoff).",
            keyPoints: ["Forward pass: Input -> Output", "Backward pass: Loss -> Gradients", "Caching activations is crucial for efficiency"]
        }
    ],
    isNew: true,
    isImportant: false,
    isExamRelevant: true,
  },
  {
    id: 'lec-003',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-dbms',
    title: 'Database Normalization: From 1NF to BCNF',
    date: '2026-01-09',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    room: 'Room 204',
    professor: 'Prof. Michael Brown',
    recordingDevices: 6,
    status: 'completed',
    summary: {
      quick: 'Comprehensive coverage of database normalization forms with practical examples. Explained functional dependencies and how to decompose tables properly.',
      detailed: [
        'First Normal Form (1NF) - Atomic values',
        'Second Normal Form (2NF) - Partial dependencies',
        'Third Normal Form (3NF) - Transitive dependencies',
        'Boyce-Codd Normal Form (BCNF) - Advanced cases'
      ],
      comprehensive: 'Complete lecture on normalization...'
    },
    sections: [
        {
            title: "Why Normalize?",
            timestamp: "00:10:00",
            duration: 10,
            content: "Normalization reduces data redundancy and improves data integrity. It prevents update anomalies, insertion anomalies, and deletion anomalies.",
            keyPoints: ["Eliminate redundancy", "Ensure data consistency", "Prevent anomalies"]
        }
    ],
    isNew: false,
    isImportant: true,
    isExamRelevant: true,
  },
  {
    id: 'lec-004',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-os',
    title: 'Process Scheduling Algorithms',
    date: '2026-01-08',
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    room: 'Room 101',
    professor: 'Dr. Robert Lee',
    recordingDevices: 8,
    status: 'completed',
    summary: {
      quick: 'Detailed explanation of CPU scheduling algorithms including FCFS, SJF, Priority, and Round Robin with examples and performance metrics.',
      detailed: [
        'First Come First Serve (FCFS)',
        'Shortest Job First (SJF)',
        'Priority Scheduling',
        'Round Robin with time quantum analysis'
      ],
      comprehensive: 'Complete lecture on scheduling...'
    },
    sections: [],
    isNew: false,
    isImportant: false,
    isExamRelevant: false,
  },
  {
    id: 'lec-live',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-networks',
    title: 'Network Security: Cryptography Basics',
    date: '2026-01-11',
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    room: 'Room 305',
    professor: 'Dr. Lisa Wang',
    recordingDevices: 6,
    status: 'live',
    isNew: false,
    isImportant: false,
    isExamRelevant: false,
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'asn-001',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-dsa',
    title: 'Graph Algorithms Implementation',
    description: 'Implement Dijkstra\'s algorithm and BFS for shortest path problems',
    requirements: [
      'Implement both algorithms in C++ or Python',
      'Test with at least 5 different graph configurations',
      'Include time complexity analysis',
      'Submit with test cases and documentation'
    ],
    announcedInLecture: {
      lectureId: 'lec-001',
      timestamp: '01:20:00'
    },
    dueDate: '2026-01-12T23:59:00',
    latePolicy: 'Late submissions accepted until 48 hours with 20% penalty',
    submissionFormat: ['PDF report', 'Source code (.cpp or .py)', 'Test cases'],
    status: 'overdue',
    batchStats: {
      submitted: 45,
      total: 60,
      avgTime: '3.5 hours'
    },
    type: 'assignment'
  },
  {
    id: 'asn-002',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-ml',
    title: 'Neural Network from Scratch',
    description: 'Implement backpropagation without using ML libraries',
    requirements: [
      'No TensorFlow, PyTorch, or similar libraries allowed',
      'Use only NumPy for matrix operations',
      'Test on MNIST dataset',
      'Achieve at least 90% accuracy',
      'Write detailed report on optimization techniques'
    ],
    announcedInLecture: {
      lectureId: 'lec-002',
      timestamp: '01:15:30'
    },
    dueDate: '2026-01-13T14:00:00',
    latePolicy: 'No late submissions accepted',
    submissionFormat: ['Jupyter Notebook', 'PDF report', 'Model weights'],
    status: 'pending',
    batchStats: {
      submitted: 12,
      total: 60,
      avgTime: '8 hours'
    },
    type: 'assignment'
  },
  {
    id: 'asn-003',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-dbms',
    title: 'Database Design Project',
    description: 'Design and implement a complete database for library management',
    requirements: [
      'ER diagram with all entities and relationships',
      'Normalize to BCNF',
      'Implement in MySQL or PostgreSQL',
      'Write 10 complex queries',
      'Include stored procedures and triggers'
    ],
    dueDate: '2026-01-18T23:59:00',
    submissionFormat: ['SQL dump file', 'ER diagram (PDF)', 'Documentation'],
    status: 'pending',
    batchStats: {
      submitted: 5,
      total: 60,
      avgTime: '12 hours'
    },
    type: 'assignment'
  },
  {
    id: 'lab-001',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-os',
    title: 'OS Lab 3: Process Scheduling Simulation',
    description: 'Simulate different CPU scheduling algorithms',
    requirements: [
      'Implement FCFS, SJF, Priority, and Round Robin',
      'Compare performance metrics',
      'Create visualization of Gantt charts',
      'Maintain physical lab record with observations'
    ],
    dueDate: '2026-01-15T17:00:00',
    submissionFormat: ['Source code', 'Lab record (scanned)', 'Results comparison'],
    status: 'pending',
    type: 'lab',
    labComponents: {
      codeSubmission: false,
      physicalRecord: false
    },
    batchStats: {
      submitted: 20,
      total: 60,
      avgTime: '4 hours'
    }
  },
  {
    id: 'asn-submitted',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-networks',
    title: 'Network Protocol Analysis',
    description: 'Analyze TCP/IP packets using Wireshark',
    requirements: [
      'Capture packets for different protocols',
      'Analyze header fields',
      'Write detailed report'
    ],
    dueDate: '2026-01-10T23:59:00',
    submissionFormat: ['PCAP files', 'Analysis report (PDF)'],
    status: 'submitted',
    submittedAt: '2026-01-10T20:30:00',
    type: 'assignment',
    batchStats: {
      submitted: 58,
      total: 60,
      avgTime: '5 hours'
    }
  }
];

export const mockExams: Exam[] = [
  {
    id: 'exam-001',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-dsa',
    title: 'Data Structures Midterm',
    type: 'midterm',
    date: '2026-01-15',
    time: '09:00',
    duration: 120,
    location: 'Main Hall A',
    professor: 'Prof. John Smith',
    syllabus: [
      {
        chapter: 'Arrays and Strings',
        topics: ['Dynamic arrays', 'String manipulation', 'Two pointer technique'],
        reviewed: true
      },
      {
        chapter: 'Linked Lists',
        topics: ['Singly linked list', 'Doubly linked list', 'Circular linked list'],
        reviewed: true
      },
      {
        chapter: 'Stacks and Queues',
        topics: ['Stack operations', 'Queue implementations', 'Priority queues'],
        reviewed: false
      },
      {
        chapter: 'Trees',
        topics: ['Binary trees', 'BST operations', 'Tree traversals'],
        reviewed: false
      },
      {
        chapter: 'Graphs',
        topics: ['Graph representations', 'BFS and DFS', 'Shortest path algorithms'],
        reviewed: false
      }
    ],
    format: {
      mcqs: 20,
      codingProblems: 3,
      theoryQuestions: 2,
      marksDistribution: 'MCQs: 20 marks, Coding: 60 marks, Theory: 20 marks',
      rules: [
        'Closed book examination',
        'No calculators allowed',
        'Write code on paper with proper syntax',
        'Total marks: 100'
      ]
    },
    importantTopics: [
      {
        topic: 'Graph traversal algorithms (BFS/DFS)',
        importance: 'high',
        professorQuote: 'This will definitely be asked in the exam. Make sure you can code it without syntax errors.',
        lectureReference: {
          lectureId: 'lec-001',
          date: '2026-01-11',
          timestamp: '00:45:20'
        }
      },
      {
        topic: 'Time complexity analysis',
        importance: 'high',
        professorQuote: 'I\'m expecting everyone to master Big-O notation. There will be multiple questions on this.',
        lectureReference: {
          lectureId: 'lec-001',
          date: '2026-01-11',
          timestamp: '01:10:00'
        }
      },
      {
        topic: 'Binary tree traversals',
        importance: 'medium',
        professorQuote: 'Know all three traversals - inorder, preorder, postorder.',
        lectureReference: {
          lectureId: 'lec-001',
          date: '2026-01-11',
          timestamp: '00:30:15'
        }
      }
    ],
    studyResources: [
      {
        title: 'CLRS Chapters 10-12',
        url: 'https://example.com/clrs',
        type: 'document'
      },
      {
        title: 'Graph Algorithms Visualization',
        url: 'https://visualgo.net',
        type: 'link'
      }
    ],
    isPast: false
  },
  {
    id: 'exam-002',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-ml',
    title: 'Machine Learning Quiz 1',
    type: 'quiz',
    date: '2026-01-14',
    time: '14:00',
    duration: 60,
    location: 'Lab 3',
    professor: 'Dr. Sarah Chen',
    syllabus: [
      {
        chapter: 'Linear Regression',
        topics: ['Gradient descent', 'Cost function', 'Feature scaling'],
        reviewed: true
      },
      {
        chapter: 'Logistic Regression',
        topics: ['Sigmoid function', 'Classification', 'Decision boundary'],
        reviewed: true
      },
      {
        chapter: 'Neural Networks Basics',
        topics: ['Perceptron', 'Activation functions', 'Forward propagation'],
        reviewed: false
      }
    ],
    format: {
      mcqs: 15,
      theoryQuestions: 3,
      marksDistribution: 'MCQs: 30 marks, Theory: 20 marks',
      rules: [
        'Open book examination',
        'Calculators allowed',
        'Total marks: 50'
      ]
    },
    importantTopics: [
      {
        topic: 'Backpropagation algorithm',
        importance: 'high',
        professorQuote: 'Understand the math behind backpropagation. This is fundamental.',
        lectureReference: {
          lectureId: 'lec-002',
          date: '2026-01-10',
          timestamp: '00:20:00'
        }
      }
    ],
    studyResources: [
      {
        title: 'Andrew Ng ML Course Notes',
        url: 'https://example.com/ml-notes',
        type: 'document'
      }
    ],
    isPast: false
  },
  {
    id: 'exam-003',
    batchId: 'batch-cs-2024',
    subjectId: 'sub-dbms',
    title: 'DBMS Final Examination',
    type: 'final',
    date: '2026-01-25',
    time: '09:00',
    duration: 180,
    location: 'Main Hall B',
    professor: 'Prof. Michael Brown',
    syllabus: [
      {
        chapter: 'ER Modeling',
        topics: ['Entities', 'Relationships', 'Cardinality'],
        reviewed: false
      },
      {
        chapter: 'Normalization',
        topics: ['1NF to BCNF', 'Functional dependencies', 'Decomposition'],
        reviewed: false
      },
      {
        chapter: 'SQL',
        topics: ['Joins', 'Subqueries', 'Aggregation', 'Stored procedures'],
        reviewed: false
      },
      {
        chapter: 'Transactions',
        topics: ['ACID properties', 'Concurrency control', 'Locking'],
        reviewed: false
      }
    ],
    format: {
      theoryQuestions: 8,
      codingProblems: 5,
      marksDistribution: 'Theory: 50 marks, SQL queries: 50 marks',
      rules: [
        'Closed book examination',
        'No electronic devices',
        'Total marks: 100'
      ]
    },
    importantTopics: [],
    studyResources: [],
    isPast: false
  }
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: 'Explain Dijkstra\'s algorithm from today\'s lecture',
    timestamp: '2026-01-11T15:30:00'
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content: 'Based on today\'s lecture, Dijkstra\'s algorithm is a greedy algorithm used to find the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.\n\nHere\'s how it works:\n\n1. **Initialization**: Set distance to source as 0, all others as infinity. Mark all vertices unvisited.\n\n2. **Main Loop**: \n   - Select unvisited vertex with minimum distance\n   - Mark it as visited\n   - Update distances of its neighbors\n\n3. **Distance Update**: For each neighbor, if (current distance + edge weight < neighbor\'s distance), update the neighbor\'s distance.\n\nAs Professor Smith emphasized, the key insight is that once a vertex is visited, its distance is finalized and won\'t change.',
    timestamp: '2026-01-11T15:30:15',
    sources: [
      {
        lectureId: 'lec-001',
        lectureTitle: 'Advanced Graph Algorithms',
        timestamp: '00:35:20',
        excerpt: 'Dijkstra algorithm maintains a set of vertices whose shortest distance is known...'
      }
    ]
  }
];

export const mockBatch: Batch = {
  id: 'batch-cs-2024',
  name: 'CS Batch 2024',
  academicYear: '2024-2025',
  semester: 5,
  students: [],
  teachers: [],
  subjects: mockSubjects,
  timetable: []
};

export const mockUser: User = {
  id: 'user-001',
  name: 'Steve Harrington',
  email: 'steve.harrington@university.edu',
  batchId: 'batch-cs-2024',
  role: 'student',
  preferences: {
    language: 'en',
    theme: 'light',
    notifications: {
      push: true,
      email: true,
      sms: false
    },
    autoRecording: true,
    locationTracking: true,
    playbackSpeed: 1.0
  },
  statistics: {
    lecturesAttended: 45,
    assignmentsCompleted: 38,
    examPerformance: 85
  }
};