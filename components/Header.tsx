import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { HeaderActions } from "./HeaderActions";

export const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <MainNav />
        <HeaderActions />
      </div>
    </header>
  );
};
