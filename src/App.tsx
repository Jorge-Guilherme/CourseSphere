import { Toaster } from "@/components/molecules/toaster";
import { Toaster as Sonner } from "@/components/molecules/sonner";
import { TooltipProvider } from "@/components/atoms/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import Login from "@/features/auth/Login";
import Dashboard from "@/features/courses/Dashboard";
import CreateCourse from "@/features/courses/CreateCourse";
import CourseDetails from "@/features/courses/CourseDetails";
import CreateLesson from "@/features/lessons/CreateLesson";
import EditLesson from "@/features/lessons/EditLesson";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/new"
                  element={
                    <ProtectedRoute>
                      <CreateCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseId/lessons/create"
                  element={
                    <ProtectedRoute>
                      <CreateLesson />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseId/lessons/:lessonId/edit"
                  element={
                    <ProtectedRoute>
                      <EditLesson />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
