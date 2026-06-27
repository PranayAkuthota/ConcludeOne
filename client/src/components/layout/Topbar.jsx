import { Bell, Search, UserCircle } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex flex-1">
        <form className="flex w-full md:ml-0" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full max-w-md text-muted-foreground focus-within:text-foreground">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="search-field"
              className="block h-full w-full border-transparent bg-transparent py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Search cases, customers, or knowledge..."
              type="search"
              name="search"
            />
          </div>
        </form>
      </div>
      <div className="ml-4 flex items-center md:ml-6 space-x-4">
        <button
          type="button"
          className="rounded-full bg-background p-1 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative ml-3">
          <button
            type="button"
            className="flex max-w-xs items-center rounded-full bg-background text-sm focus:outline-none"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            <UserCircle className="h-8 w-8 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
