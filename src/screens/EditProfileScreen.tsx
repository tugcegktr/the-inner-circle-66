import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS, INTEREST_CATEGORIES } from "@/data/mockData";
import { ZodiacSign } from "@/types/app";

export const EditProfileScreen = () => {
  const { currentUser, setCurrentUser, setScreen } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [height, setHeight] = useState(currentUser.height);
  const [profession, setProfession] = useState(currentUser.profession || "");
  const [zodiac, setZodiac] = useState(currentUser.zodiacSign);
  const [hobbies, setHobbies] = useState(currentUser.hobbyPreferences);
  const [instagram, setInstagram] = useState(currentUser.instagramHandle || "");

  const toggleTag = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const save = () => {
    setCurrentUser({
      ...currentUser,
      name, bio, city, height, profession,
      zodiacSign: zodiac as ZodiacSign,
      hobbyPreferences: hobbies,
      interests: hobbies.slice(0, 3),
      instagramHandle: instagram,
    });
    setScreen(currentUser.isApproved ? "profile" : "waiting-approval");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex items-center gap-4">
        <button onClick={() => setScreen(currentUser.isApproved ? "profile" : "waiting-approval")} className="text-muted-foreground hover:text-foreground transition-colors">←</button>
        <h1 className="font-serif text-2xl flex-1">Profili Düzenle</h1>
        <button onClick={save} className="text-gold text-sm font-medium">Kaydet</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 space-y-6">
        {[
          { label: "Ad Soyad", value: name, onChange: setName },
          { label: "Şehir", value: city, onChange: setCity },
          { label: "Boy (cm)", value: height, onChange: setHeight },
          { label: "Meslek", value: profession, onChange: setProfession },
        ].map(({ label, value, onChange }) => (
          <div key={label}>
            <label className="text-xs tracking-wider text-gold uppercase mb-2 block">{label}</label>
            <input value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm" />
          </div>
        ))}

        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Hakkında</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={150}
            className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm resize-none" />
          <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/150</p>
        </div>

        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-2 block">Instagram</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@kullaniciadin"
            className="w-full bg-surface rounded-xl px-4 py-3.5 text-foreground border border-border focus:border-gold outline-none transition-colors text-sm" />
        </div>

        {/* Sun Sign */}
        <div>
          <label className="text-xs tracking-wider text-gold uppercase mb-3 block">Güneş Burcu</label>
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

        {/* Interest categories */}
        {INTEREST_CATEGORIES.map(({ category, items }) => (
          <div key={category}>
            <label className="text-xs tracking-wider text-gold uppercase mb-3 block">{category}</label>
            <div className="flex flex-wrap gap-2">
              {items.map((opt) => (
                <button key={opt} onClick={() => toggleTag(hobbies, setHobbies, opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    hobbies.includes(opt) ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground border border-border hover:border-gold"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

      </div>

      <div className="fixed bottom-0 left-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-background to-transparent">
        <button onClick={save} className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider hover:opacity-90 active:scale-95 transition-all">
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
};
