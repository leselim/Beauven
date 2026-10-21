import { useCallback, useEffect, useRef, useState } from 'react';
import Nav from './components/Nav.jsx';
import Intro from './components/Intro.jsx';
import Search from './components/Search.jsx';
import { Swap } from './components/Motion.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { HomeLeft, HomePanel } from './views/Home.jsx';
import { StoryLeft, StoryPanel } from './views/Story.jsx';
import { StoreLeft, StorePanel } from './views/Store.jsx';

const VIEWS = {
  home: { title: 'Beauven | Say hello', Left: HomeLeft, Panel: HomePanel },
  story: { title: 'Our Story | Beauven', Left: StoryLeft, Panel: StoryPanel },
  store: { title: 'Store coming soon | Beauven', Left: StoreLeft, Panel: StorePanel },
};

const fromHash = () => {
  const h = window.location.hash.replace('#', '');
  return VIEWS[h] ? h : 'home';
};

// Keeps the address bar in step with the tab. Sandboxed previews (and some
// embeds) refuse history changes, so the site carries on without the URL update.
function setUrlHash(next) {
  try {
    if (window.location.hash !== `#${next}`) window.history.pushState(null, '', `#${next}`);
  } catch {
    /* history is locked in this context; navigation still works */
  }
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [ready, setReady] = useState(!showIntro);
  const [view, setView] = useState(fromHash);
  const [search, setSearch] = useState(false);
  const pendingFocus = useRef(null);
  const viewRef = useRef(view);
  const card = useRef(null);

  useEffect(() => {
    const onHash = () => {
      viewRef.current = fromHash();
      setView(viewRef.current);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = VIEWS[view].title;
  }, [view]);

  const focusPending = useCallback(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    const el = document.getElementById(id);
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const go = useCallback(
    (next, opts = {}) => {
      pendingFocus.current = opts.focus || null;
      setUrlHash(next);
      if (viewRef.current === next) setTimeout(focusPending, 30);
      viewRef.current = next;
      setView(next);
      if (window.innerWidth < 900 && !opts.focus) {
        card.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [focusPending]
  );

  // ⌘K / Ctrl+K or "/" opens search
  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(e.target.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ToastProvider>
      {showIntro ? (
        <Intro
          onReveal={() => setReady(true)}
          onDone={() => setShowIntro(false)}
        />
      ) : null}

      <main className="page">
        {ready ? (
          <div className="card" ref={card}>
            <Nav view={view} go={go} openSearch={() => setSearch(true)} />

            <section className={`stage stage--${view}`}>
              <Swap
                value={view}
                className="stage__left"
                onEntered={focusPending}
                render={(v) => {
                  const L = VIEWS[v].Left;
                  return <L go={go} />;
                }}
              />
              <div className={`panel panel--${view}`}>
                <Swap
                  value={view}
                  className="panel__inner"
                  render={(v) => {
                    const P = VIEWS[v].Panel;
                    return <P go={go} />;
                  }}
                />
              </div>
            </section>
          </div>
        ) : null}
        <footer className={`footnote ${ready ? 'is-in' : ''}`}>
          <span>© {new Date().getFullYear()} Beauven</span>
          <span>Beauty beneath it all</span>
        </footer>
      </main>

      <Search open={search} onClose={() => setSearch(false)} go={go} />
    </ToastProvider>
  );
}
