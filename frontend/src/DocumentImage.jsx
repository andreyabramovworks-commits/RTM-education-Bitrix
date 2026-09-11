import React, { useEffect, useRef, useState } from "react";

export function DocumentImage({ item, bridge }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ url: "", error: false });
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { root: host.current?.closest(".dc-reader-viewport"), rootMargin: "700px" });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    let objectUrl = "";
    setState({ url: "", error: false });
    if (!item.assetUrl) { setState({ url: "", error: true }); return; }
    bridge.loadDocumentAsset(item.assetUrl, controller.signal).then((blob) => {
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob);
      setState({ url: objectUrl, error: false });
    }).catch(() => { if (!controller.signal.aborted) setState({ url: "", error: true }); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [visible, item.assetUrl, bridge, attempt]);
  return <div ref={host} className={`dc-image-content ${state.url && !state.error ? "is-loaded" : "is-pending"}`}
    style={{ "--dc-image-ratio": item.width && item.height ? item.width / item.height : 1.5 }}>
    {state.error ? <div className="dc-image-error" role="status"><span>Не удалось загрузить иллюстрацию</span><button type="button" onClick={() => setAttempt((value) => value + 1)}>Повторить</button></div>
      : state.url ? <img src={state.url} alt={item.alt || "Иллюстрация"} onError={() => setState({ url: "", error: true })} />
        : <span className="dc-image-placeholder" role="status" aria-label="Загрузка иллюстрации" />}
  </div>;
}
