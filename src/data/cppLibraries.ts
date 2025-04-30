
import { Library } from "../models/types";

// Core set of C++ libraries
export const cppLibraries: Library[] = [
  // C++ Libraries - Core and Utilities
  {
    id: "cpp-boost",
    name: "Boost",
    description: "Набор высококачественных библиотек C++",
    version: "1.83.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.9,
    tags: ["utilities", "algorithms", "performance"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-eigen",
    name: "Eigen",
    description: "Библиотека линейной алгебры для C++",
    version: "3.4.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["linear-algebra", "matrices", "scientific"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-fmt",
    name: "fmt",
    description: "Современная библиотека форматирования строк для C++",
    version: "10.1.1",
    language: "cpp",
    source: "Conan",
    popularity: 4.6,
    tags: ["formatting", "strings", "io"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-abseil",
    name: "Abseil",
    description: "Библиотека основных компонентов C++ от Google",
    version: "20230802.1",
    language: "cpp",
    source: "Conan",
    popularity: 4.5,
    tags: ["utilities", "google", "string"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-poco",
    name: "POCO",
    description: "Коллекция классов C++ для разработки сетевых приложений",
    version: "1.12.5",
    language: "cpp",
    source: "Conan",
    popularity: 4.4,
    tags: ["networking", "database", "utilities"],
    isPaid: false,
    isGame: false
  },
  
  // C++ Graphics and Games
  {
    id: "cpp-sfml",
    name: "SFML",
    description: "Simple and Fast Multimedia Library для C++",
    version: "2.6.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.6,
    tags: ["graphics", "audio", "games"],
    isPaid: false,
    isGame: true
  },
  {
    id: "cpp-sdl2",
    name: "SDL2",
    description: "Simple DirectMedia Layer: мультимедийная библиотека",
    version: "2.28.3",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["graphics", "audio", "input", "games"],
    isPaid: false,
    isGame: true
  },
  {
    id: "cpp-opengl",
    name: "OpenGL",
    description: "API для рендеринга 2D и 3D графики",
    version: "4.6.0",
    language: "cpp",
    source: "System",
    popularity: 4.8,
    tags: ["graphics", "rendering", "3d"],
    isPaid: false,
    isGame: true
  },
  {
    id: "cpp-bullet",
    name: "Bullet Physics",
    description: "Физический движок для симуляции 3D коллизий",
    version: "3.25",
    language: "cpp",
    source: "Conan",
    popularity: 4.5,
    tags: ["physics", "game-engine", "collision"],
    isPaid: false,
    isGame: true
  },
  
  // C++ UI
  {
    id: "cpp-qt",
    name: "Qt6",
    description: "Кроссплатформенный фреймворк для разработки ПО",
    version: "6.5.3",
    language: "cpp",
    source: "Conan",
    popularity: 4.8,
    tags: ["gui", "widgets", "cross-platform"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-imgui",
    name: "Dear ImGui",
    description: "Быстрый и минималистичный графический интерфейс для C++",
    version: "1.90.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.9,
    tags: ["gui", "immediate-mode", "graphics"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-wxwidgets",
    name: "wxWidgets",
    description: "Кроссплатформенная библиотека виджетов для C++",
    version: "3.2.3",
    language: "cpp",
    source: "Conan",
    popularity: 4.3,
    tags: ["gui", "widgets", "cross-platform"],
    isPaid: false,
    isGame: false
  },
  
  // C++ Network and Web
  {
    id: "cpp-asio",
    name: "Asio",
    description: "Кроссплатформенная библиотека асинхронного ввода-вывода",
    version: "1.28.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["networking", "async", "io"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-crow",
    name: "Crow",
    description: "C++ микрофреймворк для веб-приложений",
    version: "1.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.3,
    tags: ["web", "http", "framework"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-grpc",
    name: "gRPC",
    description: "Высокопроизводительный RPC фреймворк",
    version: "1.59.2",
    language: "cpp",
    source: "Conan",
    popularity: 4.6,
    tags: ["rpc", "protobuf", "networking"],
    isPaid: false,
    isGame: false
  },
  
  // Testing and development tools
  {
    id: "cpp-catch2",
    name: "Catch2",
    description: "Современный фреймворк для модульного тестирования на C++",
    version: "3.4.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["testing", "unit-tests", "tdd"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-nlohmann-json",
    name: "JSON for Modern C++",
    description: "Библиотека для работы с JSON в современном C++",
    version: "3.11.2",
    language: "cpp",
    source: "Conan",
    popularity: 4.8,
    tags: ["json", "serialization", "parsing"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-opencv",
    name: "OpenCV",
    description: "Библиотека компьютерного зрения для C++",
    version: "4.8.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["computer-vision", "image-processing", "machine-learning"],
    isPaid: false,
    isGame: false
  }
];
