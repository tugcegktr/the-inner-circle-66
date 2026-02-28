import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS, MUSIC_OPTIONS, HOBBY_OPTIONS, PERSONALITY_TAGS } from "@/data/mockData";
import { ZodiacSign } from "@/types/app";

export const EditProfileScreen = () => {
  const { currentUser, setCurrentUser, setScreen } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [height, setHeight] = useState(currentUser.height);
  const [zodiac, setZodiac] = useState(currentUser.zodiacSign);
  const [music, setMusic] = useState(currentUser.musicTaste);
  const [hobbies, setHobbies] = useState(currentUser.hobbyPreferences);
  const [personality, setPersonality] = useState(currentUser.personalityTags);
  const [instagram, setInstagram] = useState(currentUser.instagramHandle || "");

  const toggleTag = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const save = () => {
    setCurrentUser({
      ...currentUser,
      name, bio, city, height,
      zodiacSign: zodiac as ZodiacSign,
      musicTaste: music,
      hobbyPreferences: hobbies,
      personalityTags: personality,
      interests: [...music.slice(0, 2), ...hobbies.slice(0, 1)],
      instagramHandle: instagram,
    });
    setScreen("profile");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex items-center gap-4">
        <button onClick={() => setScreen("profile")} className="text-muted-foreground hover:text-foreground transition-colors">←</button>
        <h1 className="font-serif text-2xl flex-1">Edit Profile</h1>
        <button onClick={save} className="text-gold text-sm font-medium">Save</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 space-y-6">
        {/* Basic */}
        {[
          { label: "Name", value: name, onChange: setName },
          { label: "City", value: city, onChange: setCity },
          { label: "Height", value: height, onChange: setHeight },
        ].map(({ label, value, onChange }) => (
          <div key={label}>
            <label className="text-xs tracking-wider text-gold uppercase mb-2 block">{label}</label>
            <input value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm" />
          </div>
        ))}

        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={150}
            className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm resize-none" />
          <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/150</p>
        </div>

        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Instagram</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle"
            className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm" />
        </div>

        {/* Sun Sign */}
        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Sun Sign</label>
          <div className="grid grid-cols-4 gap-2">
            {ZODIAC_SIGNS.map((sign) => (
              <button key={sign} onClick={() => setZodiac(sign as ZodiacSign)}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                  zodiac === sign ? "glass-gold border-gold" : "bg-surface border-border"
                }`}>
                <span className="text-lg">{ZODIAC_SYMBOLS[sign]}</span>
                <span className="text-xs text-muted-foreground">{sign.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Music */}
        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Music Taste</label>
          <div className="flex flex-wrap gap-2">
            {MUSIC_OPTIONS.map((opt) => (
              <button key={opt} onClick={() => toggleTag(music, setMusic, opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  music.includes(opt) ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground border border-border hover:border-gold"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Hobbies</label>
          <div className="flex flex-wrap gap-2">
            {HOBBY_OPTIONS.map((opt) => (
              <button key={opt} onClick={() => toggleTag(hobbies, setHobbies, opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  hobbies.includes(opt) ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground border border-border hover:border-gold"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Personality</label>
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_TAGS.map((opt) => (
              <button key={opt} onClick={() => toggleTag(personality, setPersonality, opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  personality.includes(opt) ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground border border-border hover:border-gold"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-8 pt-4 bg-gradient-to-t from-background to-transparent">
        <button onClick={save} className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider hover:opacity-90 active:scale-95 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
};
