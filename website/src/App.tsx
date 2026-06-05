import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import ProjectOverview from './sections/ProjectOverview';
import DatasetOverview from './sections/DatasetOverview';
import TechStack from './sections/TechStack';
import AnalysisDashboard from './sections/AnalysisDashboard';
import A1Verified from './sections/analysis/A1Verified';
import A2ValueAnalysis from './sections/analysis/A2ValueAnalysis';
import A3ReviewLength from './sections/analysis/A3ReviewLength';
import A4YearlyTrends from './sections/analysis/A4YearlyTrends';
import A5WeakLink from './sections/analysis/A5WeakLink';
import A6Classification from './sections/analysis/A6Classification';
import A7CabinSensitivity from './sections/analysis/A7CabinSensitivity';
import A8Inconsistency from './sections/analysis/A8Inconsistency';
import A9RootCause from './sections/analysis/A9RootCause';
import MLResults from './sections/MLResults';
import BusinessInsights from './sections/BusinessInsights';
import ProjectArchitecture from './sections/ProjectArchitecture';
import Conclusion from './sections/Conclusion';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-slate-100">
      <Navbar />

      <main>
        {/* Hero — full-screen intro */}
        <Hero />

        {/* Project Overview — problem, objectives, methodology */}
        <ProjectOverview />

        {/* Dataset Overview — schema, stats, preprocessing */}
        <DatasetOverview />

        {/* Tech Stack — technology badges grid */}
        <TechStack />

        {/* Analysis Dashboard — KPIs + overview charts + module nav */}
        <AnalysisDashboard />

        {/* A1-A9: Individual Analysis Sections */}
        <A1Verified />
        <A2ValueAnalysis />
        <A3ReviewLength />
        <A4YearlyTrends />
        <A5WeakLink />
        <A6Classification />
        <A7CabinSensitivity />
        <A8Inconsistency />
        <A9RootCause />

        {/* Machine Learning Results */}
        <MLResults />

        {/* Business Insights — Apple keynote style */}
        <BusinessInsights />

        {/* Project Architecture — pipeline flow diagram */}
        <ProjectArchitecture />

        {/* Conclusion — summary, limitations, future work */}
        <Conclusion />
      </main>

      <Footer />
    </div>
  );
}
