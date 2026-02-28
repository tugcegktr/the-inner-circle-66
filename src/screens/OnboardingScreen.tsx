import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS, MUSIC_OPTIONS, HOBBY_OPTIONS, PERSONALITY_TAGS } from "@/data/mockData";
import { ZodiacSign } from "@/types/app";

const steps = ["basic", "photos", "lifestyle", "zodiac", "social"] as const;

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

const TagSelector = ({
  options, selected, onToggle, max = 5
}: { options: string[], selected: string[], onToggle: (v: string) => void, max?: number }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      return (
        <button
          key={opt}
          onClick={() => (!isSelected && selected.length >= max) ? null : onToggle(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isSelected
              ? "gold-gradient text-primary-foreground shadow-gold-sm"
              : "bg-muted text-muted-foreground border border-border hover:border-gold"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

export const OnboardingScreen = () => {
  const { setScreen, currentUser, setCurrentUser } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(currentUser.name);
  const [dob, setDob] = useState("1997-06-15");
  const [city, setCity] = useState(currentUser.city);
  const [height, setHeight] = useState(currentUser.height);
  const [bio, setBio] = useState(currentUser.bio);
  const [photos, setPhotos] = useState<string[]>(currentUser.photos);
  const [music, setMusic] = useState<string[]>(currentUser.musicTaste);
  const [hobbies, setHobbies] = useState<string[]>(currentUser.hobbyPreferences);
  const [personality, setPersonality] = useState<string[]>(currentUser.personalityTags);
  const [zodiac, setZodiac] = useState<ZodiacSign>(currentUser.zodiacSign);
  const [rising, setRising] = useState<ZodiacSign | undefined>(currentUser.risingSign);
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

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    setCurrentUser({
      ...currentUser,
      name, city, height, bio,
      photos,
      musicTaste: music,
      hobbyPreferences: hobbies,
      personalityTags: personality,
      interests: [...music.slice(0, 2), ...hobbies.slice(0, 1)],
      zodiacSign: zodiac,
      risingSign: rising,
      instagramHandle: instagram,
      linkedinUrl: linkedin,
    });
    setScreen("waitlist");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <StepIndicator current={step} />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gold font-serif text-lg">♦</span>
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">The Club</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Tell us about you</h2>
              <p className="text-muted-foreground text-sm">This information helps curate your experience</p>
            </div>

            {[
              { label: "Full Name", value: name, onChange: setName, placeholder: "Alexandra" },
              { label: "City", value: city, onChange: setCity, placeholder: "New York" },
              { label: "Height", value: height, onChange: setHeight, placeholder: "5'6\"" },
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
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Your Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={150}
                placeholder="A few words about yourself..."
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground border border-border focus:border-gold outline-none transition-colors text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/150</p>
            </div>
          </div>
        )}

        {/* Step 1: Photos */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Fotoğrafların</h2>
              <p className="text-muted-foreground text-sm">
                En az <span className="text-gold font-medium">5 fotoğraf</span> eklemen zorunlu, maksimum 6. İlk fotoğraf kapak fotoğrafın olur.
              </p>
            </div>
            {photos.length < 5 && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
                <span className="text-destructive text-sm">⚠️</span>
                <p className="text-xs text-destructive">{5 - photos.length} fotoğraf daha eklemen gerekiyor.</p>
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
                          Main
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

            {/* Identity Verification */}
            <div className="glass-gold rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-sm">✓</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Identity Verification</p>
                  <p className="text-xs text-muted-foreground">Get your Verified badge</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Take a real-time selfie to verify your identity and unlock the Verified badge on your profile.</p>
              <button className="w-full py-2.5 rounded-lg gold-gradient text-primary-foreground text-xs font-medium tracking-wider">
                📸 Take Verification Selfie
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Lifestyle */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Your Vibe</h2>
              <p className="text-muted-foreground text-sm">Select up to 5 in each category</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Music Taste</label>
              <TagSelector options={MUSIC_OPTIONS} selected={music} onToggle={(v) => setMusic(music.includes(v) ? music.filter((x) => x !== v) : [...music, v])} />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Hobby Preferences</label>
              <TagSelector options={HOBBY_OPTIONS} selected={hobbies} onToggle={(v) => setHobbies(hobbies.includes(v) ? hobbies.filter((x) => x !== v) : [...hobbies, v])} />
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Personality Tags</label>
              <TagSelector options={PERSONALITY_TAGS} selected={personality} onToggle={(v) => setPersonality(personality.includes(v) ? personality.filter((x) => x !== v) : [...personality, v])} />
            </div>
          </div>
        )}

        {/* Step 3: Zodiac */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Astro Profile</h2>
              <p className="text-muted-foreground text-sm">Your stars guide your connections</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Sun Sign</label>
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
              <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Rising Sign (Optional)</label>
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

        {/* Step 4: Social */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-1">Social Links</h2>
              <p className="text-muted-foreground text-sm">Link at least one social profile for verification</p>
            </div>

            <div className="glass-gold rounded-xl p-4 mb-2">
              <p className="text-xs text-gold font-medium mb-1">🔒 Required for Approval</p>
              <p className="text-xs text-muted-foreground">The Club requires at least one verified social profile. Links are never shared with other members.</p>
            </div>

            <div>
              <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Instagram Handle</label>
              <div className="flex items-center gap-2 bg-surface rounded-xl px-4 py-3.5 border border-border focus-within:border-gold transition-colors">
                <span className="text-muted-foreground text-sm">📸</span>
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourusername"
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
                  placeholder="linkedin.com/in/you"
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your application will be reviewed by our team within 24–48 hours. We manually approve every member to maintain the quality of The Club.
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
            disabled={step === 1 && photos.length < 5}
            className="flex-[2] py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
          >
            {step === steps.length - 1
              ? "Başvuruyu Gönder"
              : step === 1 && photos.length < 5
              ? `${5 - photos.length} fotoğraf daha ekle`
              : "Devam Et →"}
          </button>
        </div>
      </div>
    </div>
  );
};
