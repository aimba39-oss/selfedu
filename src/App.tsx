import { Navigate, Route, Routes } from "react-router-dom";

import SiteLayout from "./components/SiteLayout";

import Home from "./pages/Home";
import Practice from "./pages/Practice";

import Reading from "./pages/Reading";
import ReadingBook from "./pages/ReadingBook";
import ReadingTest from "./pages/ReadingTest";
import ReadingResults from "./pages/ReadingResults";

import Listening from "./pages/Listening";
import ListeningTest from "./pages/ListeningTest";
import ListeningResults from "./pages/ListeningResults";

import Writing from "./pages/Writing";
import WritingTest from "./pages/WritingTest";
import WritingResults from "./pages/WritingResults";

import Speaking from "./pages/Speaking";
import SpeakingInterview from "./pages/SpeakingInterview";
import SpeakingResults from "./pages/SpeakingResults";

import AICoach from "./pages/AICoach";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />

        <Route path="/reading" element={<Reading />} />
        <Route
          path="/reading/cambridge/:bookId"
          element={<ReadingBook />}
        />
        <Route
          path="/reading/cambridge/:bookId/test/:testNumber"
          element={<ReadingTest />}
        />
        <Route
          path="/reading/cambridge/:bookId/test/:testNumber/results"
          element={<ReadingResults />}
        />

        <Route path="/listening" element={<Listening />} />
        <Route
          path="/listening/test/:testNumber"
          element={<ListeningTest />}
        />
        <Route
          path="/listening/test/:testNumber/results"
          element={<ListeningResults />}
        />

        <Route path="/writing" element={<Writing />} />
        <Route
          path="/writing/:taskId"
          element={<WritingTest />}
        />
        <Route
          path="/writing/:taskId/results"
          element={<WritingResults />}
        />

        <Route path="/speaking" element={<Speaking />} />
        <Route
          path="/speaking/interview"
          element={<SpeakingInterview />}
        />
        <Route
          path="/speaking/results"
          element={<SpeakingResults />}
        />

        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;