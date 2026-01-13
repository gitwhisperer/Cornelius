import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TopBar } from "./components/layout/TopBar";
import { BottomNavigation } from "./components/layout/BottomNavigation";
import { HomeDashboard } from "./components/screens/HomeDashboard";
import { LecturesLibrary } from "./components/screens/LecturesLibrary";
import { TasksCalendar } from "./components/screens/TasksCalendar";
import { AIChat } from "./components/screens/AIChat";
import { Profile } from "./components/screens/Profile";
import { Notifications } from "./components/screens/Notifications";
import { AppShell } from "./components/layout/AppShell";
import {
  allLectures,
  allAssignments,
  mockExams,
  mockSubjects,
  mockUser,
} from "./data/mockData";
import type { Screen } from "./types";

function AppContent() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("home");

  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case "home":
        return "Cornelius";
      case "lectures":
        return "Lectures";
      case "tasks":
        return "Tasks & Calendar";
      case "chat":
        return "AI Assistant";
      case "profile":
        return "Profile";
      case "notifications":
        return "Notifications";
      default:
        return "Cornelius";
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeDashboard
            lectures={allLectures}
            assignments={allAssignments}
            onNavigate={setCurrentScreen}
          />
        );
      case "lectures":
        return (
          <LecturesLibrary
            lectures={allLectures}
            subjects={mockSubjects}
          />
        );
      case "tasks":
        return (
          <TasksCalendar
            assignments={allAssignments}
            exams={mockExams}
            subjects={mockSubjects}
            onNavigate={setCurrentScreen}
          />
        );
      case "chat":
        return (
          <AIChat
            onNavigate={setCurrentScreen}
            lectures={allLectures}
            assignments={allAssignments}
            exams={mockExams}
            user={mockUser}
          />
        );
      case "profile":
        return <Profile user={mockUser} />;
      case "notifications":
        return <Notifications onNavigate={setCurrentScreen} />;
      default:
        return (
          <HomeDashboard
            lectures={mockLectures}
            assignments={mockAssignments}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] transition-colors overflow-hidden">
      <TopBar
        title={getScreenTitle()}
        onNavigate={setCurrentScreen}
      />

      <main className="flex-1 overflow-y-auto pt-16 pb-4">
        {renderScreen()}
      </main>

      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <AppContent />
      </AppShell>
    </ThemeProvider>
  );
}