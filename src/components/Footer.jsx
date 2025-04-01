export default function Footer() {
  return (
    <footer className="bg-gray-800 py-6 text-center mt-auto">
      <p className="text-white">
        &copy; {new Date().getFullYear()} TrendSpotter. All rights reserved.
      </p>
    </footer>
  );
}
