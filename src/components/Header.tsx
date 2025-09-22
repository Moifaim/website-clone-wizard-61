import { Search, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-portal-blue-dark text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          <Menu className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;