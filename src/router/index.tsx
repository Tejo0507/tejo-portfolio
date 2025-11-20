import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import { MainLayout, OSLayout } from "@/layouts"

const LandingPage = lazy(() => import("@/pages/Landing"))
const AboutPage = lazy(() => import("@/pages/About"))
const SkillsPage = lazy(() => import("@/pages/Skills"))
const ProjectListPage = lazy(() => import("@/pages/Projects/ProjectList"))
const ProjectDetailPage = lazy(() => import("@/pages/Projects/ProjectDetail"))
const BookPortfolioPage = lazy(() => import("@/pages/BookPortfolio/index"))
const StudyMaterialsPage = lazy(() => import("@/pages/StudyMaterials/index"))
const TimetablePage = lazy(() => import("@/pages/Timetable/index"))
const SnippetsPage = lazy(() => import("@/pages/Snippets/index"))
const DashboardHomePage = lazy(() => import("@/pages/Dashboard"))
const DashboardProjectsPage = lazy(() => import("@/pages/Dashboard/ProjectsAnalytics"))
const DashboardSkillsPage = lazy(() => import("@/pages/Dashboard/SkillsDashboard"))
const DashboardAiLabPage = lazy(() => import("@/pages/Dashboard/AiLabInsights"))
const DashboardWidgetsPage = lazy(() => import("@/pages/Dashboard/SystemWidgets"))
const DashboardSettingsPage = lazy(() => import("@/pages/Dashboard/Settings"))
const AiLabPage = lazy(() => import("@/pages/AiLab"))
const ImageClassifierPage = lazy(() => import("@/pages/AiLab/tools/ImageClassifier"))
const TextSentimentPage = lazy(() => import("@/pages/AiLab/tools/TextSentiment"))
const NumberPredictorPage = lazy(() => import("@/pages/AiLab/tools/NumberPredictor"))
const KMeansPage = lazy(() => import("@/pages/AiLab/tools/KMeansVisualizer"))
const PCAPage = lazy(() => import("@/pages/AiLab/tools/PCAVisualizer"))
const TokenizerPage = lazy(() => import("@/pages/AiLab/tools/TextTokenizer"))
const ChatbotPage = lazy(() => import("@/pages/AiLab/tools/RuleChatbot"))
const MatrixCalculatorPage = lazy(() => import("@/pages/AiLab/tools/MatrixCalculator"))
const ScalingPlaygroundPage = lazy(() => import("@/pages/AiLab/tools/ScalingPlayground"))
const OSPage = lazy(() => import("@/pages/OS/index"))
const BlogListPage = lazy(() => import("@/pages/Blog/BlogList"))
const BlogPostPage = lazy(() => import("@/pages/Blog/BlogPost"))
const CertificationsPage = lazy(() => import("@/pages/Certifications/index"))
const ContactPage = lazy(() => import("@/pages/Contact/index"))
const UpcomingFeaturesPage = lazy(() => import("@/pages/UpcomingFeatures/index"))
const AdminLoginPage = lazy(() => import("@/pages/Admin/Login"))
const AdminDashboardPage = lazy(() => import("@/pages/Admin/Dashboard"))
const AdminProjectsPage = lazy(() => import("@/pages/Admin/Projects"))
const AdminSkillsPage = lazy(() => import("@/pages/Admin/Skills"))
const AdminSnippetsPage = lazy(() => import("@/pages/Admin/Snippets"))
const AdminAiLabPage = lazy(() => import("@/pages/Admin/AiLab"))
const AdminMessagesPage = lazy(() => import("@/pages/Admin/Messages"))
const AdminSettingsPage = lazy(() => import("@/pages/Admin/Settings"))
const RouteErrorBoundary = lazy(() => import("@/pages/Errors/RouteErrorBoundary"))

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="projects">
            <Route index element={<ProjectListPage />} />
            <Route path=":id" element={<ProjectDetailPage />} />
          </Route>
          <Route path="book-portfolio" element={<BookPortfolioPage />} />
          <Route path="ai-lab">
            <Route index element={<AiLabPage />} />
            <Route path="image-classification" element={<ImageClassifierPage />} />
            <Route path="text-sentiment" element={<TextSentimentPage />} />
            <Route path="number-predictor" element={<NumberPredictorPage />} />
            <Route path="kmeans" element={<KMeansPage />} />
            <Route path="pca" element={<PCAPage />} />
            <Route path="tokenizer" element={<TokenizerPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="matrix" element={<MatrixCalculatorPage />} />
            <Route path="scaling" element={<ScalingPlaygroundPage />} />
          </Route>
          <Route path="study-materials" element={<StudyMaterialsPage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="snippets" element={<SnippetsPage />} />
          <Route path="dashboard">
            <Route index element={<DashboardHomePage />} />
            <Route path="projects" element={<DashboardProjectsPage />} />
            <Route path="skills" element={<DashboardSkillsPage />} />
            <Route path="ai-lab" element={<DashboardAiLabPage />} />
            <Route path="widgets" element={<DashboardWidgetsPage />} />
            <Route path="settings" element={<DashboardSettingsPage />} />
          </Route>
          <Route path="blog">
            <Route index element={<BlogListPage />} />
            <Route path=":id" element={<BlogPostPage />} />
          </Route>
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="upcoming-features" element={<UpcomingFeaturesPage />} />
        </Route>

        <Route path="os" element={<OSLayout />}>
          <Route index element={<OSPage />} />
        </Route>

        <Route path="admin">
          <Route index element={<AdminLoginPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="snippets" element={<AdminSnippetsPage />} />
          <Route path="ai-lab" element={<AdminAiLabPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<RouteErrorBoundary />} />
      </Routes>
    </Suspense>
  )
}
