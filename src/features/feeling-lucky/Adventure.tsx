import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Camera,
  Download,
  ImageUp,
  Code2,
  BriefcaseBusiness,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import * as React from "react";
import {
  type AdventureChoices,
  type AdventureOutcome,
  type ChoiceScene,
  type PseudocodeBlockId,
  CODE_CHALLENGE,
  DIAGNOSIS_SCENE,
  PARTNERSHIP_SCENE,
  PRIORITY_SCENE,
  SOLUTION_SCENE,
  createAdventureOutcome,
  evaluateCodeOrder,
  getSafeCodeOrder,
} from "./story";
import heroImage from "./assets/great-wall-blue-hour.webp";
import relayScene from "./assets/dragon-relay-scene.webp";
import solutionScene from "./assets/solution-route-scene.webp";
import priorityScene from "./assets/priority-modules-scene.webp";
import codeScene from "./assets/code-control-scene.webp";
import partnershipScene from "./assets/partnership-beacons-scene.webp";
import paperImage from "./assets/expedition-paper.webp";
import "./adventure.css";
import "./site-cohesion.css";

type Screen =
  | "intro"
  | "portrait"
  | "generating"
  | "reveal"
  | "diagnosis"
  | "solution"
  | "priority"
  | "code"
  | "partnership"
  | "resolution"
  | "postcard"
  | "contact";

type StoryScreen = "diagnosis" | "solution" | "priority" | "partnership";

const SCREEN_STEP: Partial<Record<Screen, number>> = {
  diagnosis: 0,
  solution: 1,
  priority: 2,
  code: 3,
  partnership: 4,
  resolution: 5,
};

const sceneByScreen = {
  diagnosis: DIAGNOSIS_SCENE,
  solution: SOLUTION_SCENE,
  priority: PRIORITY_SCENE,
  partnership: PARTNERSHIP_SCENE,
} as const;

function newSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "_");
  }
  return `adventure_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = `${line}${word} `;
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line.trim(), x, cursorY);
      line = `${word} `;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  context.fillText(line.trim(), x, cursorY);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="adventure-icon-button" type="button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function StoryProgress({ screen }: { screen: Screen }) {
  const active = SCREEN_STEP[screen] ?? 0;
  return (
    <div className="story-progress" aria-label={`Adventure chapter ${Math.min(active + 1, 5)} of 5`}>
      <span>Expedition 01</span>
      <div className="story-progress__dots" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((step) => (
          <i key={step} className={step <= active ? "is-active" : ""} />
        ))}
      </div>
      <span>{Math.min(active + 1, 5)} / 5</span>
    </div>
  );
}

function ChoiceChapter<T extends string>({
  scene,
  selected,
  onChoose,
}: {
  scene: ChoiceScene<T>;
  selected?: T;
  onChoose: (choice: T, response: string) => void;
}) {
  const summaries: Record<string, string> = {
    diagnosis: "A mechanical dragon is overheating an old signal relay. It looks confused, not hostile.",
    solution: "The Wall needs its signal. The dragon needs to recharge. Design for both.",
    priority: "The old relay can optimize one principle first.",
    partnership: "The repair works. The dragon would like a job title.",
  };
  return (
    <article className="journal-panel chapter-card">
      <p className="adventure-eyebrow">{scene.eyebrow}</p>
      <h2>{scene.title}</h2>
      <p>{summaries[scene.id]}</p>
      <div className="chapter-rule" />
      <h3>{scene.prompt}</h3>
      <div className="choice-grid">
        {scene.choices.map((choice, index) => (
          <button
            className={`choice-card ${selected === choice.id ? "is-selected" : ""}`}
            type="button"
            key={choice.id}
            onClick={() => onChoose(choice.id, choice.response)}
          >
            <span className="choice-card__number">0{index + 1}</span>
            <span>
              <strong>{choice.label}</strong>
              <small>{choice.description}</small>
            </span>
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        ))}
      </div>
    </article>
  );
}

function ScenarioImage({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <figure className="scenario-image">
      <img src={src} alt={alt} />
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export default function Adventure() {
  const [screen, setScreen] = React.useState<Screen>("intro");
  const [sessionId, setSessionId] = React.useState(newSessionId);
  const [portrait, setPortrait] = React.useState<File | null>(null);
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
  const [portraitPreview, setPortraitPreview] = React.useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [cameraError, setCameraError] = React.useState("");
  const [generationNote, setGenerationNote] = React.useState("");
  const [showSlowFallback, setShowSlowFallback] = React.useState(false);
  const [progress, setProgress] = React.useState<Partial<AdventureChoices>>({});
  const [response, setResponse] = React.useState("");
  const [nextScreen, setNextScreen] = React.useState<Screen | null>(null);
  const [codeOrder, setCodeOrder] = React.useState<PseudocodeBlockId[]>(
    CODE_CHALLENGE.blocks.map((block) => block.id),
  );
  const [codeFeedback, setCodeFeedback] = React.useState("");
  const [codeCorrect, setCodeCorrect] = React.useState(false);
  const [downloadBusy, setDownloadBusy] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const generationController = React.useRef<AbortController | null>(null);
  const generationStarted = React.useRef(false);

  const imageSrc = generatedImage ?? heroImage.src;
  const scenarioImages: Partial<Record<Screen, string>> = {
    diagnosis: relayScene.src,
    solution: solutionScene.src,
    priority: priorityScene.src,
    code: codeScene.src,
    partnership: partnershipScene.src,
  };
  const storyImageSrc = scenarioImages[screen] ?? imageSrc;
  const cinematic = !["intro", "portrait", "contact"].includes(screen);
  const scenarioLabel: Partial<Record<Screen, string>> = {
    diagnosis: "The relay is overheating",
    solution: "Find a safe path for both systems",
    priority: "Choose what the first version protects",
    code: "Put the control loop in order",
    partnership: "The dragon needs a new role",
  };
  const outcome: AdventureOutcome | null =
    progress.diagnosis &&
    progress.solution &&
    progress.priority &&
    progress.codeOrder &&
    progress.partnership
      ? createAdventureOutcome(progress as AdventureChoices)
      : null;

  React.useEffect(() => {
    return () => {
      stopTracks(streamRef.current);
      generationController.current?.abort();
      if (portraitPreview) URL.revokeObjectURL(portraitPreview);
      if (generatedImage) URL.revokeObjectURL(generatedImage);
    };
  }, [generatedImage, portraitPreview]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraStream) return;
    video.srcObject = cameraStream;
    void video.play().catch(() => {
      setCameraError("The camera opened, but the preview could not start. Try uploading a portrait instead.");
    });
  }, [cameraStream]);

  React.useEffect(() => {
    if (screen !== "generating") return;
    const timer = window.setTimeout(() => setShowSlowFallback(true), 12_000);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const selectPortrait = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/) || file.size > 10 * 1024 * 1024) {
      setCameraError("Choose a JPEG, PNG, or WebP image under 10 MB.");
      return;
    }
    if (portraitPreview) URL.revokeObjectURL(portraitPreview);
    setPortrait(file);
    setPortraitPreview(URL.createObjectURL(file));
    setCameraError("");
    stopTracks(streamRef.current);
    streamRef.current = null;
    setCameraStream(null);
  };

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraStream(stream);
    } catch {
      setCameraError("Camera access wasn’t available. Upload a portrait or continue anonymously.");
    }
  };

  const capturePortrait = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) return;
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    context.drawImage(video, sx, sy, size, size, 0, 0, 1024, 1024);
    canvas.toBlob((blob) => {
      if (blob) selectPortrait(new File([blob], "portrait.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  };

  const useFallback = (note = "You joined under a little extra mystery.") => {
    generationController.current?.abort();
    setIsAnonymous(true);
    setGenerationNote(note);
    setScreen("reveal");
  };

  const generatePortrait = async () => {
    if (!portrait || generationStarted.current) return;
    generationStarted.current = true;
    stopTracks(streamRef.current);
    setCameraStream(null);
    setScreen("generating");
    setShowSlowFallback(false);
    const controller = new AbortController();
    generationController.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 120_000);

    try {
      const form = new FormData();
      form.append("sessionId", sessionId);
      form.append("portrait", portrait);
      const result = await fetch("/api/feeling-lucky/generate", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      if (!result.ok) throw new Error("generation failed");
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
      setGenerationNote("Your portrait crossed the mist. One image, made for this session.");
      setScreen("reveal");
    } catch {
      if (controller.signal.aborted && screen === "reveal") return;
      useFallback("The mountain mist kept the portrait. Your silhouette made the rendezvous anyway.");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const chooseAnonymous = () => {
    setIsAnonymous(true);
    setGenerationNote("No portrait leaves your device. The Wall still has a place for you.");
    setScreen("reveal");
  };

  const chooseStory = (storyScreen: StoryScreen, choice: string, choiceResponse: string) => {
    const next: Record<StoryScreen, Screen> = {
      diagnosis: "solution",
      solution: "priority",
      priority: "code",
      partnership: "resolution",
    };
    setProgress((current) => ({ ...current, [storyScreen]: choice }));
    setResponse(choiceResponse);
    setNextScreen(next[storyScreen]);
  };

  const continueResponse = () => {
    if (!nextScreen) return;
    setResponse("");
    setScreen(nextScreen);
    setNextScreen(null);
  };

  const moveCode = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= codeOrder.length) return;
    const updated = [...codeOrder];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setCodeOrder(updated);
    setCodeFeedback("");
  };

  const submitCode = () => {
    const result = evaluateCodeOrder(codeOrder);
    setCodeFeedback(result.message);
    setCodeCorrect(result.correct);
    if (result.correct) setProgress((current) => ({ ...current, codeOrder }));
  };

  const useSafeOrder = () => {
    const safe = [...getSafeCodeOrder()];
    setCodeOrder(safe);
    setProgress((current) => ({ ...current, codeOrder: safe }));
    setCodeFeedback(evaluateCodeOrder(safe).message);
    setCodeCorrect(true);
  };

  const downloadPostcard = async () => {
    if (!outcome || downloadBusy) return;
    setDownloadBusy(true);
    try {
      const [photo, paper] = await Promise.all([loadImage(imageSrc), loadImage(paperImage.src)]);
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1067;
      const context = canvas.getContext("2d");
      if (!context) return;
      drawCover(context, paper, 0, 0, canvas.width, canvas.height);
      context.save();
      context.shadowColor = "rgba(17, 24, 39, .35)";
      context.shadowBlur = 24;
      drawCover(context, photo, 76, 70, 1448, 685);
      context.restore();
      const gradient = context.createLinearGradient(76, 560, 76, 755);
      gradient.addColorStop(0, "rgba(8, 15, 31, 0)");
      gradient.addColorStop(1, "rgba(8, 15, 31, .72)");
      context.fillStyle = gradient;
      context.fillRect(76, 530, 1448, 225);
      context.fillStyle = "#f2b45f";
      context.font = "600 23px ui-monospace, monospace";
      context.fillText("FIELD POSTCARD · GREAT WALL · BLUE HOUR", 118, 710);
      context.fillStyle = "#172033";
      context.font = "700 54px Georgia, serif";
      context.fillText(outcome.title, 105, 850);
      context.font = "30px Georgia, serif";
      wrapText(context, outcome.postcardLine, 105, 912, 1375, 42);
      context.font = "600 20px ui-monospace, monospace";
      context.fillStyle = "#8b5a24";
      context.fillText("JOIN ANDREW ON AN ADVENTURE", 105, 1016);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "great-wall-adventure-postcard.jpg";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }, "image/jpeg", 0.93);
    } finally {
      setDownloadBusy(false);
    }
  };

  const resetAdventure = () => {
    stopTracks(streamRef.current);
    setCameraStream(null);
    generationController.current?.abort();
    if (portraitPreview) URL.revokeObjectURL(portraitPreview);
    if (generatedImage) URL.revokeObjectURL(generatedImage);
    setScreen("intro");
    setSessionId(newSessionId());
    setPortrait(null);
    setPortraitPreview(null);
    setGeneratedImage(null);
    setIsAnonymous(false);
    setCameraError("");
    setGenerationNote("");
    setProgress({});
    setResponse("");
    setCodeOrder(CODE_CHALLENGE.blocks.map((block) => block.id));
    setCodeFeedback("");
    setCodeCorrect(false);
    generationStarted.current = false;
  };

  const goBack = () => {
    const back: Partial<Record<Screen, Screen>> = {
      portrait: "intro",
      reveal: portrait ? "portrait" : "intro",
      diagnosis: "reveal",
      solution: "diagnosis",
      priority: "solution",
      code: "priority",
      partnership: "code",
      resolution: "partnership",
      postcard: "resolution",
      contact: "postcard",
    };
    const destination = back[screen];
    if (destination) {
      setResponse("");
      setNextScreen(null);
      setScreen(destination);
    }
  };

  const scene =
    screen === "diagnosis" ||
    screen === "solution" ||
    screen === "priority" ||
    screen === "partnership"
      ? sceneByScreen[screen]
      : null;

  return (
    <div className={`adventure-shell screen-${screen} ${cinematic ? "is-cinematic" : "is-site"}`}>
      {cinematic && <div className="adventure-world" aria-hidden="true">
        <img src={storyImageSrc} alt="" className="adventure-world__image" />
        <div className="adventure-world__grade" />
      </div>}

      {screen !== "intro" && screen !== "generating" && (
        <button className="adventure-back" type="button" onClick={goBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
      )}

      <main className="adventure-stage" aria-live="polite">
        {SCREEN_STEP[screen] !== undefined && <StoryProgress screen={screen} />}

        {screen === "intro" && (
          <section className="intro-card scene-enter">
            <p className="adventure-eyebrow">Feeling lucky?</p>
            <h1>Take a short detour.</h1>
            <p className="intro-card__lead">
              A two-minute interactive story about solving an unexpected problem with Andrew.
            </p>
            <div className="intro-card__actions">
              <button className="adventure-button adventure-button--primary" type="button" onClick={() => setScreen("portrait")}>
                Start the adventure <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="adventure-button adventure-button--ghost" type="button" onClick={chooseAnonymous}>
                Keep me anonymous
              </button>
            </div>
            <p className="intro-card__meta">2–3 minutes · one optional generated image</p>
          </section>
        )}

        {screen === "portrait" && (
          <section className="journal-panel portrait-panel scene-enter">
            <div className="portrait-copy">
              <p className="adventure-eyebrow">Expedition portrait · Optional</p>
              <h1>Step into the chapter.</h1>
              <p>Add a portrait to appear in the story, or skip it.</p>
              <div className="consent-note">
                <ShieldCheck size={22} aria-hidden="true" />
                <p><strong>Before you continue</strong>Your portrait is sent to OpenAI once to create the image. This demo does not keep it.</p>
              </div>
            </div>
            <div className="portrait-studio">
              <div className="portrait-frame">
                {portraitPreview ? (
                  <img src={portraitPreview} alt="Your selected portrait preview" />
                ) : cameraStream ? (
                  <video ref={videoRef} muted playsInline aria-label="Live camera preview" />
                ) : (
                  <div className="portrait-placeholder"><Camera size={42} /><span>Your portrait appears here</span></div>
                )}
                <span className="corner corner-tl" /><span className="corner corner-tr" />
                <span className="corner corner-bl" /><span className="corner corner-br" />
              </div>
              {cameraError && <p className="form-message" role="alert">{cameraError}</p>}
              <div className="portrait-actions">
                {!portrait && !cameraStream && (
                  <button className="adventure-button adventure-button--primary" type="button" onClick={startCamera}>
                    <Camera size={18} /> Open camera
                  </button>
                )}
                {!portrait && cameraStream && (
                  <button className="adventure-button adventure-button--primary" type="button" onClick={capturePortrait}>
                    <Camera size={18} /> Capture portrait
                  </button>
                )}
                {portrait && (
                  <>
                    <button className="adventure-button adventure-button--primary" type="button" onClick={generatePortrait}>
                      Create my adventure <Sparkles size={18} />
                    </button>
                    <button className="adventure-button adventure-button--ghost" type="button" onClick={() => { setPortrait(null); setPortraitPreview(null); }}>
                      <RefreshCw size={16} /> Retake
                    </button>
                  </>
                )}
                {!portrait && (
                  <label className="adventure-button adventure-button--ghost file-button">
                    <ImageUp size={17} /> Upload portrait
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => event.target.files?.[0] && selectPortrait(event.target.files[0])} />
                  </label>
                )}
              </div>
              <button className="text-button" type="button" onClick={chooseAnonymous}>Continue without a portrait</button>
            </div>
          </section>
        )}

        {screen === "generating" && (
          <section className="generating-card scene-enter">
            <div className="portal-ring"><span /><span /><span /><Sparkles size={28} /></div>
            <p className="adventure-eyebrow">Composing one image for this session</p>
            <h1>The mountain is making room for you.</h1>
            <p>Matching blue-hour light, mist, and one unexpectedly cooperative mechanical dragon…</p>
            <div className="generation-track"><i /></div>
            {showSlowFallback && (
              <button className="adventure-button adventure-button--ghost" type="button" onClick={() => useFallback("You took the fast path through the mist. Your silhouette joins the chapter.")}>
                Continue with the cinematic fallback
              </button>
            )}
          </section>
        )}

        {screen === "reveal" && (
          <section className="reveal-card scene-enter">
            <div className="reveal-image">
              <img src={imageSrc} alt={generatedImage ? "You and Andrew in a blue-hour Great Wall adventure with a distant mechanical dragon" : "Andrew at the Great Wall at blue hour with a mysterious co-adventurer silhouette and distant mechanical dragon"} />
              {isAnonymous && <div className="coadventurer-silhouette" aria-label="Mysterious co-adventurer silhouette" />}
              <div className="reveal-caption"><span>Chapter 01</span><strong>The signal in the mist</strong></div>
            </div>
            <div className="reveal-copy">
              <p className="adventure-eyebrow">Rendezvous confirmed</p>
              <h1>You made it.</h1>
              <p>{generationNote} A signal has gone dark in the mist.</p>
              <button className="adventure-button adventure-button--primary" type="button" onClick={() => setScreen("diagnosis")}>
                Follow Andrew into the mist <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {scene && !response && (
          <section className="decision-spread scene-enter">
            <ScenarioImage
              src={storyImageSrc}
              alt={`Illustrated story scene: ${scenarioLabel[screen] ?? scene.title}`}
              label={scenarioLabel[screen] ?? scene.title}
            />
            <ChoiceChapter
              scene={scene as ChoiceScene<string>}
              selected={progress[screen as keyof AdventureChoices] as string | undefined}
              onChoose={(choice, choiceResponse) => chooseStory(screen as StoryScreen, choice, choiceResponse)}
            />
          </section>
        )}

        {response && (
          <section className="decision-spread scene-enter">
            <ScenarioImage
              src={storyImageSrc}
              alt={`Illustrated story scene: ${scenarioLabel[screen] ?? "Field observation"}`}
              label={scenarioLabel[screen] ?? "Field observation"}
            />
            <article className="journal-panel response-card">
              <p className="adventure-eyebrow">Field note</p>
              <p className="response-card__copy">{response}</p>
              <button className="adventure-button adventure-button--primary" type="button" onClick={continueResponse}>
                Next decision <ArrowRight size={18} />
              </button>
            </article>
          </section>
        )}

        {screen === "code" && (
          <section className="decision-spread scene-enter">
            <ScenarioImage
              src={storyImageSrc}
              alt="A brass field terminal with four control blocks beside the Great Wall relay"
              label={scenarioLabel.code!}
            />
            <div className="terminal-panel">
            <div className="terminal-panel__header">
              <div><i /><i /><i /></div><span>wall-relay / safe-routing.loop</span><span>LIVE</span>
            </div>
            <div className="terminal-panel__body">
              <p className="adventure-eyebrow">{CODE_CHALLENGE.eyebrow}</p>
              <h2>{CODE_CHALLENGE.title}</h2>
              <p>{CODE_CHALLENGE.body}</p>
              <div className="code-list" aria-label="Reorderable pseudocode blocks">
                {codeOrder.map((id, index) => {
                  const block = CODE_CHALLENGE.blocks.find((item) => item.id === id)!;
                  return (
                    <div className="code-block" key={id}>
                      <span>{index + 1}</span>
                      <code>{block.code}</code>
                      <small>{block.plainEnglish}</small>
                      <div>
                        <IconButton label={`Move ${block.code} up`} onClick={() => moveCode(index, -1)}><ArrowUp size={15} /></IconButton>
                        <IconButton label={`Move ${block.code} down`} onClick={() => moveCode(index, 1)}><ArrowDown size={15} /></IconButton>
                      </div>
                    </div>
                  );
                })}
              </div>
              {codeFeedback && <p className={`code-feedback ${codeCorrect ? "is-correct" : ""}`} role="status">{codeFeedback}</p>}
              <div className="terminal-actions">
                {!codeCorrect ? (
                  <>
                    <button className="adventure-button adventure-button--primary" type="button" onClick={submitCode}>Run control loop</button>
                    {codeFeedback && <button className="text-button" type="button" onClick={useSafeOrder}>Use Andrew’s safe sequence</button>}
                  </>
                ) : (
                  <button className="adventure-button adventure-button--primary" type="button" onClick={() => setScreen("partnership")}>
                    Route the signal <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
            </div>
          </section>
        )}

        {screen === "resolution" && outcome && (
          <section className="resolution-card scene-enter">
            <div className="resolution-visual">
              <img src={imageSrc} alt="The restored Great Wall signal route beneath the mechanical dragon" />
              {isAnonymous && <div className="coadventurer-silhouette is-small" />}
              <div className="resolution-beacons"><i /><i /><i /><i /><i /></div>
            </div>
            <div className="journal-panel resolution-copy">
              <p className="adventure-eyebrow">Incident resolved · All beacons online</p>
              <h1>{outcome.title}</h1>
              <p>{outcome.outcome}</p>
              <blockquote>{outcome.fieldNote}</blockquote>
              <button className="adventure-button adventure-button--primary" type="button" onClick={() => setScreen("postcard")}>
                Seal the field postcard <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {screen === "postcard" && outcome && (
          <section className="postcard-stage scene-enter">
            <div className="postcard" style={{ backgroundImage: `url(${paperImage.src})` }}>
              <div className="postcard__photo">
                <img src={imageSrc} alt="Your Great Wall adventure postcard" />
                {isAnonymous && <div className="coadventurer-silhouette is-small" />}
                <span>Great Wall · Blue hour</span>
              </div>
              <div className="postcard__copy">
                <p className="adventure-eyebrow">Field postcard · Expedition 01</p>
                <h1>{outcome.title}</h1>
                <p>{outcome.postcardLine}</p>
                <small>Dragon assignment: {outcome.dragonRole}</small>
              </div>
            </div>
            <div className="postcard-actions">
              <button className="adventure-button adventure-button--primary" type="button" onClick={downloadPostcard} disabled={downloadBusy}>
                <Download size={18} /> {downloadBusy ? "Preparing postcard…" : "Download postcard"}
              </button>
              <button className="adventure-button adventure-button--ghost" type="button" onClick={resetAdventure}><RefreshCw size={17} /> Start another adventure</button>
              <button className="text-button" type="button" onClick={() => setScreen("contact")}>Return gently to reality <ArrowRight size={15} /></button>
            </div>
          </section>
        )}

        {screen === "contact" && (
          <section className="contact-card scene-enter">
            <p className="adventure-eyebrow">End of transmission</p>
            <h1>The dragon was fictional.<br /><em>The problems worth solving aren’t.</em></h1>
            <p>Want to build something real?</p>
            <div className="contact-links">
              <a href="mailto:andrzej.firek@uni.minerva.edu"><Mail size={19} /> Email Andrew</a>
              <a href="https://github.com/Muifrend" target="_blank" rel="noreferrer"><Code2 size={19} /> GitHub</a>
              <a href="https://www.linkedin.com/in/andrzej-firek-237bb7256/" target="_blank" rel="noreferrer"><BriefcaseBusiness size={19} /> LinkedIn</a>
            </div>
            <button className="text-button" type="button" onClick={resetAdventure}><RefreshCw size={15} /> Start another adventure</button>
          </section>
        )}
      </main>

    </div>
  );
}
