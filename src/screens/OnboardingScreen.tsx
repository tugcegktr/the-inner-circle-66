import React, { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS, INTEREST_CATEGORIES, PERSONALITY_TAGS, GENDER_OPTIONS } from "@/data/mockData";
import { ZodiacSign, UserGender, LookingFor } from "@/types/app";

// Steps: basic → lookingFor → gender → astro → interests → music → photos → social
const steps = ["basic", "lookingFor", "gender", "astro", "interests", "music", "photos", "social"] as const;

const MUSIC_GENRES = [
  "Pop", "Rock", "Alternatif", "Indie", "Rap / Hip-Hop", "R&B",
  "Elektronik / EDM", "House / Techno", "Jazz", "Blues", "Klasik Müzik",
  "Latin", "Reggaeton", "Türkçe Pop", "Türkçe Rock", "Arabesk",
  "Halk Müziği", "Metal", "Lo-fi / Chill", "Soundtrack / Film Müzikleri",
];

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center gap-2 justify-center mb-8">
    {steps.map((_, i) => (
      <div
        key={i}
        className="transition-all duration-300"
        style={{
          width: i === current ? "2rem" : "0.5rem",
          height: "4px",
          borderRadius: "2px",
          background: i <= current ? "hsl(var(--gold))" : "hsl(var(--border))",
        }}
      />
    ))}
  </div>
);

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
  "https://images.unsplash.com/photo-1502323703975-b9630fe78d8b?w=600&q=80",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80",
];

export const OnboardingScreen = () => {
  const { setScreen, currentUser, setCurrentUser } = useApp();
  const [step, setStep] = useState(0);

  // Step 0 – Basic
  const [firstName, setFirstName] = useState(currentUser.name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(currentUser.name.split(" ")[1] || "");
  const [dob, setDob] = useState("1997-06-15");
  const [city, setCity] = useState(currentUser.city);
  const [height, setHeight] = useState(currentUser.height);
  const [profession, setProfession] = useState(currentUser.profession || "");
  const [bio, setBio] = useState(currentUser.bio);

  // Step 1 – Looking For
  const [lookingFor, setLookingFor] = useState<LookingFor[]>((currentUser.lookingFor as LookingFor[]) || []);

  // Step 2 – Gender
  const [gender, setGender] = useState<UserGender>(currentUser.gender);
  const [interestedIn, setInterestedIn] = useState<UserGender[]>(currentUser.interestedIn);

  // Step 2 – Astro
  const [zodiac, setZodiac] = useState<ZodiacSign>(currentUser.zodiacSign);
  const [rising, setRising] = useState<ZodiacSign | undefined>(currentUser.risingSign);

  // Step 3 – Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser.hobbyPreferences);
  const [personality, setPersonality] = useState<string[]>(currentUser.personalityTags);

  // Step 4 – Music
  const [selectedMusic, setSelectedMusic] = useState<string[]>(currentUser.musicTaste || []);

  // Step 5 – Photos
  const [photos, setPhotos] = useState<string[]>(currentUser.photos);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  // Step 5 – Social
  const [instagram, setInstagram] = useState(currentUser.instagramHandle || "");
  const [linkedin, setLinkedin] = useState(currentUser.linkedinUrl || "");

  const addPhoto = () => {
    if (photos.length < 6) {
      setPhotos([...photos, MOCK_PHOTOS[photos.length % MOCK_PHOTOS.length]]);
    }
  };

  const removePhoto = (i: number) => setPhotos(photos.filter((_, idx) => idx !== i));

  // Drag-to-reorder
  const handleDragStart = (i: number) => setDraggingIdx(i);
  const handleDragEnter = (i: number) => { dragOverIdx.current = i; };
  const handleDragEnd = () => {
    if (draggingIdx !== null && dragOverIdx.current !== null && draggingIdx !== dragOverIdx.current) {
      const reordered = [...photos];
      const [moved] = reordered.splice(draggingIdx, 1);
      reordered.splice(dragOverIdx.current, 0, moved);
      setPhotos(reordered);
    }
    setDraggingIdx(null);
    dragOverIdx.current = null;
  };

  const toggleInterestedIn = (val: UserGender) =>
    setInterestedIn((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);

  const toggleInterest = (val: string) =>
    setSelectedInterests((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);

  const togglePersonality = (val: string) =>
    setPersonality((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);

  const toggleMusic = (val: string) =>
    setSelectedMusic((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);

  const canProceed = () => {
    if (step === 0) return firstName.trim().length > 0 && city.trim() && height.trim() && profession.trim() && dob;
    if (step === 1) return lookingFor.length > 0;
    if (step === 2) return interestedIn.length > 0;
    if (step === 6) return photos.length >= 5;
    return true;
  };

  const btnLabel = () => {
    if (step === steps.length - 1) return "Başvuruyu Gönder";
    if (step === 6 && photos.length < 5) return `${5 - photos.length} fotoğraf daha ekle`;
    return "Devam Et →";
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    const dobDate = new Date(dob);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    setCurrentUser({
      ...currentUser,
      name: `${firstName}${lastName ? " " + lastName : ""}`,
      city, height, bio, profession,
      age,
      gender, interestedIn,
      photos,
      hobbyPreferences: selectedInterests,
      personalityTags: personality,
      interests: selectedInterests.slice(0, 3),
      musicTaste: selectedMusic,
      zodiacSign: zodiac,
      risingSign: rising,
      instagramHandle: instagram,
      linkedinUrl: linkedin,
      lookingFor,
    });
    setScreen("waitlist");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      <div className="px-6 pt-12 pb-4">
        <StepIndicator current={step} />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gold font-serif text-lg">♦</span>
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">The Club</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">

        {/* ── STEP 0: Temel Bilgiler ── */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Seni Tanıyalım</h2>
              <p className="text-muted-foreground text-sm">Bu bilgiler deneyimini kişiselleştirmek için kullanılır</p>
            </div>

            {/* Ad & Soyad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs tracking-wider text-gold uppercase mb-2 block">
                  Ad <span className="text-destructive">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adın"
                  className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Soyad</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadın"
                  className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">
                Doğum Tarihi <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">
                Şehir <span className="text-destructive">*</span>
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="İstanbul"
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">
                Boy (cm) <span className="text-destructive">*</span>
              </label>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">
                Meslek <span className="text-destructive">*</span>
              </label>
              <input
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Mesleğin"
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Hakkında</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={150}
                placeholder="Kendini kısaca anlat... (isteğe bağlı)"
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/150</p>
            </div>
          </div>
        )}

        {/* ── STEP 1: Ne Arıyorsun ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Ne Arıyorsun?</h2>
              <p className="text-muted-foreground text-sm">Birden fazla seçebilirsin — profilinde gösterilir</p>
            </div>

            {[
              {
                value: "dating" as LookingFor,
                emoji: "💛",
                title: "Dating",
                desc: "Anlamlı bir ilişki veya romantik bağ arıyorum.",
              },
              {
                value: "networking" as LookingFor,
                emoji: "🤝",
                title: "Networking",
                desc: "Profesyonel bağlantılar ve iş birliği fırsatları arıyorum.",
              },
              {
                value: "friendship" as LookingFor,
                emoji: "✨",
                title: "Friendship",
                desc: "Kaliteli arkadaşlıklar ve sosyal çevre genişletmek istiyorum.",
              },
            ].map(({ value, emoji, title, desc }) => {
              const isSelected = lookingFor.includes(value);
              return (
                <button
                  key={value}
                  onClick={() =>
                    setLookingFor((prev) =>
                      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
                    )
                  }
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected ? "glass-gold border-gold" : "bg-surface border-border hover:border-gold/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all ${
                      isSelected ? "gold-gradient" : "bg-muted"
                    }`}
                  >
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm mb-0.5 ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "border-gold gold-gradient" : "border-border"
                    }`}
                  >
                    {isSelected && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── STEP 2: Cinsiyet ── */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Cinsiyet Bilgileri</h2>
              <p className="text-muted-foreground text-sm">Sana uygun profilleri göstermek için</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-4 block">Ben bir…</label>
              <div className="space-y-2">
                {GENDER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setGender(value as UserGender)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left ${
                      gender === value ? "glass-gold border-gold" : "bg-surface border-border hover:border-gold/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      gender === value ? "border-gold" : "border-border"
                    }`}>
                      {gender === value && <div className="w-2.5 h-2.5 rounded-full gold-gradient" />}
                    </div>
                    <span className={`text-sm font-medium ${gender === value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">İlgilendiğim cinsiyet(ler)</label>
              <p className="text-xs text-muted-foreground mb-4">Birden fazla seçebilirsin</p>
              <div className="space-y-2">
                {GENDER_OPTIONS.map(({ value, label }) => {
                  const isSelected = interestedIn.includes(value as UserGender);
                  return (
                    <button
                      key={value}
                      onClick={() => toggleInterestedIn(value as UserGender)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left ${
                        isSelected ? "glass-gold border-gold" : "bg-surface border-border hover:border-gold/50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-gold gold-gradient" : "border-border"
                      }`}>
                        {isSelected && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Astro Profil ── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Astro Profilin</h2>
              <p className="text-muted-foreground text-sm">Yıldızlar bağlantılarına rehberlik eder</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Güneş Burcu</label>
              <div className="grid grid-cols-4 gap-2">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = zodiac === sign;
                  return (
                    <button
                      key={sign}
                      onClick={() => setZodiac(sign as ZodiacSign)}
                      className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                        isSelected
                          ? "border-gold shadow-[0_0_12px_2px_hsl(var(--gold)/0.5)] bg-[hsl(var(--gold)/0.15)]"
                          : "bg-surface border-border hover:border-gold/50"
                      }`}
                      style={isSelected ? { borderWidth: "2px" } : {}}
                    >
                      <span className={`text-lg ${isSelected ? "drop-shadow-[0_0_6px_hsl(var(--gold))]" : ""}`}>{ZODIAC_SYMBOLS[sign]}</span>
                      <span className={`text-xs ${isSelected ? "text-gold font-semibold" : "text-muted-foreground"}`}>{sign.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Yükselen Burç <span className="text-muted-foreground normal-case">(isteğe bağlı)</span></label>
              <div className="grid grid-cols-4 gap-2">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = rising === sign;
                  return (
                    <button
                      key={sign}
                      onClick={() => setRising(rising === (sign as ZodiacSign) ? undefined : sign as ZodiacSign)}
                      className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                        isSelected
                          ? "border-gold shadow-[0_0_10px_1px_hsl(var(--gold)/0.4)] bg-[hsl(var(--gold)/0.12)]"
                          : "bg-surface border-border hover:border-gold/50"
                      }`}
                      style={isSelected ? { borderWidth: "2px" } : {}}
                    >
                      <span className="text-lg">{ZODIAC_SYMBOLS[sign]}</span>
                      <span className={`text-xs ${isSelected ? "text-gold font-semibold" : "text-muted-foreground"}`}>{sign.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: İlgi Alanları ── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">İlgi Alanların</h2>
              <p className="text-muted-foreground text-sm">Birden fazla seçebilirsin — seçimler profilinde görünür</p>
            </div>

            {INTEREST_CATEGORIES.map(({ category, items }) => (
              <div key={category}>
                <label className="text-xs tracking-wider text-gold uppercase mb-3 block">{category}</label>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? "gold-gradient text-primary-foreground shadow-gold-sm"
                            : "bg-muted text-muted-foreground border border-border hover:border-gold"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Kişilik Etiketleri</label>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TAGS.map((tag) => {
                  const isSelected = personality.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => togglePersonality(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "gold-gradient text-primary-foreground shadow-gold-sm"
                          : "bg-muted text-muted-foreground border border-border hover:border-gold"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Müzik Zevki ── */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Müzik Zevkin</h2>
              <p className="text-muted-foreground text-sm">Dinlediğin türleri seç — profilde görünür</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map((genre) => {
                const isSelected = selectedMusic.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleMusic(genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "gold-gradient text-primary-foreground shadow-gold-sm"
                        : "bg-muted text-muted-foreground border border-border hover:border-gold"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 5: Fotoğraflar ── */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Fotoğrafların</h2>
              <p className="text-muted-foreground text-sm">
                En az <span className="text-gold font-medium">5 fotoğraf</span> zorunlu, maksimum 6.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                📌 İlk fotoğraf kapak fotoğrafın olur. Sürükleyerek sıralayabilirsin.
              </p>
            </div>

            {photos.length < 5 && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
                <span className="text-destructive text-sm">⚠️</span>
                <p className="text-xs text-destructive">{5 - photos.length} fotoğraf daha eklemelisin.</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-[3/4] rounded-xl overflow-hidden relative transition-all ${
                    draggingIdx === i ? "opacity-50 scale-95" : ""
                  }`}
                  style={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))" }}
                  draggable={!!photos[i]}
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={handleDragEnd}
                >
                  {photos[i] ? (
                    <>
                      <img src={photos[i]} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute top-2 left-2 text-xs gold-gradient px-2 py-0.5 rounded-full text-primary-foreground font-medium">
                          Kapak
                        </div>
                      )}
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                        <span className="text-white/60 text-xs">⠿</span>
                      </div>
                    </>
                  ) : (
                    <button onClick={addPhoto} className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl hover:text-gold transition-colors">
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="glass-gold rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-sm">✓</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Kimlik Doğrulama</p>
                  <p className="text-xs text-muted-foreground">Onaylı rozet kazan</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Anlık bir selfie çekerek kimliğini doğrula ve profilinde Onaylı rozetini kazan.</p>
              <button className="w-full py-2.5 rounded-lg gold-gradient text-primary-foreground text-xs font-medium tracking-wider">
                📸 Doğrulama Selfie'si Çek
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: Sosyal Profil ── */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Sosyal Profiller</h2>
              <p className="text-muted-foreground text-sm">Doğrulama için en az bir sosyal profil bağla</p>
            </div>

            <div className="glass-gold rounded-xl p-4 mb-2">
              <p className="text-xs text-gold font-medium mb-1">🔒 Onay İçin Gerekli</p>
              <p className="text-xs text-muted-foreground">The Club, en az bir doğrulanmış sosyal profil gerektirir. Linkler hiçbir zaman diğer üyelerle paylaşılmaz.</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Instagram Kullanıcı Adı</label>
              <div className="flex items-center gap-2 bg-surface rounded-xl px-4 py-3.5 border border-border focus-within:border-gold transition-colors">
                <span className="text-muted-foreground text-sm">📸</span>
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@kullaniciadin"
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">LinkedIn URL</label>
              <div className="flex items-center gap-2 bg-surface rounded-xl px-4 py-3.5 border border-border focus-within:border-gold transition-colors">
                <span className="text-muted-foreground text-sm">💼</span>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/sen"
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Başvurunuz ekibimiz tarafından en kısa sürede incelenecektir. The Club'ın kalitesini korumak için her üyeyi manuel olarak onaylıyoruz.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-8 pt-4 bg-gradient-to-t from-background to-transparent">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 rounded-xl bg-surface border border-border text-foreground text-sm font-medium hover:border-gold transition-colors"
            >
              Geri
            </button>
          )}
          <button
            onClick={next}
            disabled={!canProceed()}
            className="flex-[2] py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
          >
            {btnLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};
