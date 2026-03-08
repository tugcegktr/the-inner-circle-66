import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS, INTEREST_CATEGORIES, PERSONALITY_TAGS, GENDER_OPTIONS } from "@/data/mockData";
import { ZodiacSign, UserGender } from "@/types/app";

const steps = ["basic", "gender", "photos", "interests", "zodiac", "social"] as const;

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

export const OnboardingScreen = () => {
  const { setScreen, currentUser, setCurrentUser } = useApp();
  const [step, setStep] = useState(0);

  // Basic info
  const [name, setName] = useState(currentUser.name);
  const [dob, setDob] = useState("1997-06-15");
  const [city, setCity] = useState(currentUser.city);
  const [height, setHeight] = useState(currentUser.height);
  const [profession, setProfession] = useState(currentUser.profession || "");
  const [bio, setBio] = useState(currentUser.bio);

  // Gender
  const [gender, setGender] = useState<UserGender>(currentUser.gender);
  const [interestedIn, setInterestedIn] = useState<UserGender[]>(currentUser.interestedIn);

  // Photos
  const [photos, setPhotos] = useState<string[]>(currentUser.photos);

  // Interests (categorized)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser.hobbyPreferences);
  const [personality, setPersonality] = useState<string[]>(currentUser.personalityTags);

  // Zodiac
  const [zodiac, setZodiac] = useState<ZodiacSign>(currentUser.zodiacSign);
  const [rising, setRising] = useState<ZodiacSign | undefined>(currentUser.risingSign);

  // Social
  const [instagram, setInstagram] = useState(currentUser.instagramHandle || "");
  const [linkedin, setLinkedin] = useState(currentUser.linkedinUrl || "");

  const addPhoto = () => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
      "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
      "https://images.unsplash.com/photo-1502323703975-b9630fe78d8b?w=600&q=80",
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80",
    ];
    if (photos.length < 6) {
      setPhotos([...photos, mockPhotos[photos.length % mockPhotos.length]]);
    }
  };

  const removePhoto = (i: number) => setPhotos(photos.filter((_, idx) => idx !== i));

  const toggleInterestedIn = (val: UserGender) => {
    setInterestedIn((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const toggleInterest = (val: string) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const togglePersonality = (val: string) => {
    setPersonality((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    setCurrentUser({
      ...currentUser,
      name, city, height, bio, profession,
      gender, interestedIn,
      photos,
      hobbyPreferences: selectedInterests,
      personalityTags: personality,
      interests: selectedInterests.slice(0, 3),
      musicTaste: [],
      zodiacSign: zodiac,
      risingSign: rising,
      instagramHandle: instagram,
      linkedinUrl: linkedin,
    });
    setScreen("waitlist");
  };

  const canProceed = () => {
    if (step === 2) return photos.length >= 5;
    if (step === 1) return interestedIn.length > 0;
    return true;
  };

  const btnLabel = () => {
    if (step === steps.length - 1) return "Başvuruyu Gönder";
    if (step === 2 && photos.length < 5) return `${5 - photos.length} fotoğraf daha ekle`;
    return "Devam Et →";
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

        {/* Step 0: Temel Bilgiler */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Seni Tanıyalım</h2>
              <p className="text-muted-foreground text-sm">Bu bilgiler deneyimini kişiselleştirmek için kullanılır</p>
            </div>

            {[
              { label: "Ad Soyad", value: name, onChange: setName, placeholder: "Adın ve soyadın" },
              { label: "Şehir", value: city, onChange: setCity, placeholder: "İstanbul" },
              { label: "Boy (cm)", value: height, onChange: setHeight, placeholder: "170" },
              { label: "Meslek", value: profession, onChange: setProfession, placeholder: "Mesleğin" },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label}>
                <label className="text-xs tracking-wider text-gold uppercase mb-2 block">{label}</label>
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
                />
              </div>
            ))}

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Doğum Tarihi</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Hakkında</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={150}
                placeholder="Kendini kısaca anlat..."
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/150</p>
            </div>
          </div>
        )}

        {/* Step 1: Cinsiyet */}
        {step === 1 && (
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
                      gender === value
                        ? "glass-gold border-gold"
                        : "bg-surface border-border hover:border-gold/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      gender === value ? "border-gold" : "border-border"
                    }`}>
                      {gender === value && <div className="w-2.5 h-2.5 rounded-full gold-gradient" />}
                    </div>
                    <span className={`text-sm font-medium ${gender === value ? "text-foreground" : "text-muted-foreground"}`}>
                      {label}
                    </span>
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
                        isSelected
                          ? "glass-gold border-gold"
                          : "bg-surface border-border hover:border-gold/50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-gold gold-gradient" : "border-border"
                      }`}>
                        {isSelected && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fotoğraflar */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Fotoğrafların</h2>
              <p className="text-muted-foreground text-sm">
                En az <span className="text-gold font-medium">5 fotoğraf</span> zorunlu, maksimum 6. İlk fotoğraf kapak fotoğrafın olur.
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
                  className="aspect-[3/4] rounded-xl overflow-hidden relative"
                  style={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))" }}
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
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-foreground text-xs"
                      >
                        ✕
                      </button>
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

        {/* Step 3: İlgi Alanları */}
        {step === 3 && (
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

        {/* Step 4: Burç */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Astro Profilin</h2>
              <p className="text-muted-foreground text-sm">Yıldızların bağlantılarına rehberlik eder</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Güneş Burcu</label>
              <div className="grid grid-cols-4 gap-2">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign}
                    onClick={() => setZodiac(sign as ZodiacSign)}
                    className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      zodiac === sign
                        ? "glass-gold border-gold"
                        : "bg-surface border-border hover:border-gold/50"
                    } border`}
                  >
                    <span className="text-lg">{ZODIAC_SYMBOLS[sign]}</span>
                    <span className="text-xs text-muted-foreground">{sign.slice(0, 3)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Yükselen Burç (İsteğe Bağlı)</label>
              <div className="grid grid-cols-4 gap-2">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign}
                    onClick={() => setRising(rising === sign as ZodiacSign ? undefined : sign as ZodiacSign)}
                    className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      rising === sign
                        ? "glass-gold border-gold"
                        : "bg-surface border-border hover:border-gold/50"
                    } border`}
                  >
                    <span className="text-lg">{ZODIAC_SYMBOLS[sign]}</span>
                    <span className="text-xs text-muted-foreground">{sign.slice(0, 3)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Sosyal Medya */}
        {step === 5 && (
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
                Başvurun ekibimiz tarafından 24–48 saat içinde incelenecek. The Club'ın kalitesini korumak için her üyeyi manuel olarak onaylıyoruz.
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
