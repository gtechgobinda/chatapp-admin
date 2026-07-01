import TopBar from "../components/layout/TopBar";

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title={title} subtitle={subtitle} />
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Coming soon.
      </div>
    </div>
  );
}
