'use client';

import { useMemo, useState } from 'react';

type TransferMode = 'shared' | 'private' | 'premium';
type Activity = {
  id: string;
  title: string;
  duration: string;
  neighbourhood: string;
  pace: string;
  price: number;
  cancellation: string;
  why: string;
  image: string;
};

const steps = [
  ['Destination', '⌖'], ['Dates', '□'], ['Hotel', '▥'], ['Transfers', '↝'],
  ['Activities', '✦'], ['Markup', '%'], ['Proposal', '◇'],
];

const hotelOptions = [
  {
    id: 'trunk', tier: 'Boutique', name: 'Trunk House', place: 'Kagurazaka, Tokyo',
    line: 'A private hideaway behind the old lanes', rate: 42000, total: 116000, fit: 91,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85',
    mood: 'Intimate, local, quietly playful', room: 'Tatami suite · 42 m²', cancel: 'Free until 28 Sep', distance: '8 min to evening food walk', amenities: ['Breakfast', 'Onsen bath', 'Bar'], impact: 'Keeps ₹16k for experiences', tradeoff: 'Smaller room, most personal setting',
  },
  {
    id: 'k5', tier: 'Balanced', name: 'Hotel K5', place: 'Nihonbashi, Tokyo',
    line: 'Nordic calm inside a 1920s bank', rate: 49000, total: 132000, fit: 94,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85',
    mood: 'Designed, calm, connected', room: 'Studio king · 38 m²', cancel: 'Free until 30 Sep', distance: '12 min to Tsukiji by taxi', amenities: ['Breakfast', 'King bed', 'Record player'], impact: 'Right on the target price', tradeoff: 'Best balance, busier neighbourhood',
  },
  {
    id: 'aman', tier: 'Elevated', name: 'Aman Tokyo', place: 'Otemachi, Tokyo',
    line: 'Skyline stillness above the city', rate: 83000, total: 182000, fit: 88,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=85',
    mood: 'Polished, hushed, restorative', room: 'Deluxe king · 71 m²', cancel: '50% after 21 Sep', distance: '16 min to Tsukiji by taxi', amenities: ['Spa', 'Pool', 'City view'], impact: 'Adds ₹50k to the package', tradeoff: 'Exceptional room, firmer terms',
  },
];

const transferSegments = [
  {
    id: 'arrival', from: 'Haneda', to: 'Tokyo hotel', icon: '✈', note: 'Arrival · 18:40', fatigue: 'Arrival fatigue matters here',
    choices: { shared: ['Shared shuttle', 4200, '75–95 min'], private: ['Private meet & greet', 9800, '45–60 min'], premium: ['Premium sedan', 15800, '40–50 min'] },
  },
  {
    id: 'train', from: 'Tokyo', to: 'Kyoto', icon: '↝', note: 'Day 5 · 10:03', fatigue: 'A relaxed mid-morning departure',
    choices: { shared: ['Standard reserved', 6800, '2 hr 12 min'], private: ['Green car', 11600, '2 hr 12 min'], premium: ['GranClass + porter', 19800, '2 hr 12 min'] },
  },
  {
    id: 'kyoto', from: 'Kyoto Station', to: 'Kyoto hotel', icon: '⌂', note: 'Day 5 · 12:30', fatigue: 'Luggage-forwarding saves an hour',
    choices: { shared: ['Hotel shuttle', 2400, '35–50 min'], private: ['Private transfer', 9400, '20–30 min'], premium: ['Premium van + porter', 14600, '20–25 min'] },
  },
  {
    id: 'departure', from: 'Kyoto hotel', to: 'KIX airport', icon: '✈', note: 'Day 7 · 07:30', fatigue: 'Early start, keep this predictable',
    choices: { shared: ['Airport limousine', 5800, '95–115 min'], private: ['Private transfer', 12800, '80–95 min'], premium: ['Premium sedan', 19600, '75–90 min'] },
  },
];

const activities: Activity[] = [
  { id: 'tea', title: 'Tea, without ceremony theatre', duration: '2 hrs', neighbourhood: 'Gion', pace: 'Easy', price: 3200, cancellation: 'Free 48 hrs', why: 'A quiet first look at Kyoto craft, with time to ask questions.', image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=700&q=80' },
  { id: 'tsukiji', title: 'Tsukiji after breakfast', duration: '3 hrs', neighbourhood: 'Tsukiji', pace: 'Moderate', price: 2800, cancellation: 'Free 24 hrs', why: 'The city makes more sense once someone explains what is on the plate.', image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=700&q=80' },
  { id: 'inari', title: 'Fushimi Inari at first light', duration: '2.5 hrs', neighbourhood: 'Fushimi', pace: 'Moderate', price: 1600, cancellation: 'Free 24 hrs', why: 'An early start earns them the mountain before the crowds arrive.', image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=700&q=80' },
  { id: 'cycle', title: 'Kyoto by small roads', duration: '4 hrs', neighbourhood: 'Demachiyanagi', pace: 'Active', price: 2400, cancellation: 'Free 48 hrs', why: 'Links the gardens and backstreets without turning the day into a checklist.', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=700&q=80' },
  { id: 'art', title: 'Borderless, after dark', duration: '2 hrs', neighbourhood: 'Azabudai', pace: 'Easy', price: 2700, cancellation: 'Non-refundable', why: 'A high-energy evening that still leaves the daytime open for wandering.', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=700&q=80' },
];

const initialDays: Record<number, string[]> = { 1: ['tsukiji'], 2: ['art'], 3: [], 4: [], 5: ['tea'], 6: ['inari', 'cycle'] };
const initialTransfers: Record<string, TransferMode> = { arrival: 'private', train: 'shared', kyoto: 'private', departure: 'shared' };
const formatMoney = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

function CalendarMonth({ month, year, start, end, onDay }: { month: number; year: number; start: number | null; end: number | null; onDay: (day: number) => void }) {
  const days = new Date(year, month + 1, 0).getDate();
  const offset = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month, 1).toLocaleString('en', { month: 'long' });
  return (
    <div className="calendar-month">
      <div className="calendar-caption"><strong>{monthName}</strong><span>{year}</span></div>
      <div className="weekdays">{['S','M','T','W','T','F','S'].map((d,i) => <span key={`${d}${i}`}>{d}</span>)}</div>
      <div className="days-grid">
        {Array.from({ length: offset }).map((_, i) => <span key={`blank${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const active = month === 9 && ((start !== null && day === start) || (end !== null && day === end));
          const between = month === 9 && start !== null && end !== null && day > start && day < end;
          return <button key={day} className={`${active ? 'date-active' : ''} ${between ? 'date-between' : ''}`} onClick={() => month === 9 && onDay(day)} disabled={month !== 9 || day < 1}>{day}</button>;
        })}
      </div>
    </div>
  );
}

function HotelCard({ hotel, selected, onSelect }: { hotel: typeof hotelOptions[number]; selected: boolean; onSelect: () => void }) {
  return (
    <article className={`stay-card ${selected ? 'stay-selected' : ''}`}>
      <div className="stay-image"><img src={hotel.image} alt={`${hotel.name} room`} /><span>{hotel.tier}</span><strong>{hotel.fit}% fit</strong></div>
      <div className="stay-content">
        <small>{hotel.place}</small><h3>{hotel.name}</h3><p className="stay-line">{hotel.line}</p>
        <div className="stay-rate"><span>From</span><strong>{formatMoney(hotel.rate)}</strong><small>/ night</small></div>
        <div className="amenities">{hotel.amenities.map(a => <span key={a}>{a}</span>)}</div>
        <dl><div><dt>Cancellation</dt><dd>{hotel.cancel}</dd></div><div><dt>Location</dt><dd>{hotel.distance}</dd></div></dl>
        <button className={selected ? 'selected-stay' : ''} onClick={onSelect}>{selected ? 'Shortlisted ✓' : 'Shortlist this stay'} <span>→</span></button>
      </div>
    </article>
  );
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('Japan');
  const [searchState, setSearchState] = useState<'ready' | 'loading' | 'empty'>('ready');
  const [cities, setCities] = useState(['Tokyo', 'Kyoto']);
  const [startDay, setStartDay] = useState<number | null>(12);
  const [endDay, setEndDay] = useState<number | null>(18);
  const [flexible, setFlexible] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState(['k5']);
  const [compare, setCompare] = useState(false);
  const [transfers, setTransfers] = useState<Record<string, TransferMode>>(initialTransfers);
  const [days, setDays] = useState<Record<number, string[]>>(initialDays);
  const [removedActivities, setRemovedActivities] = useState<string[]>([]);
  const [markup, setMarkup] = useState(12);
  const [proposalView, setProposalView] = useState<'desktop' | 'mobile'>('desktop');
  const [ledgerOpen, setLedgerOpen] = useState(false);

  const markChanged = () => setDirty(true);
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };
  const goTo = (index: number) => { setStep(index); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const activeHotel = hotelOptions.find(h => h.id === selectedHotels[0]) ?? hotelOptions[1];
  const hotelCost = activeHotel.total;
  const transferCost = transferSegments.reduce((sum, segment) => sum + Number(segment.choices[transfers[segment.id]][1]), 0);
  const itineraryIds = Object.values(days).flat();
  const activityCost = activities.filter(a => itineraryIds.includes(a.id)).reduce((sum, a) => sum + a.price * 2, 0);
  const supplierCost = 143000 + hotelCost + transferCost + activityCost;
  const profit = Math.round(supplierCost * markup / 100);
  const customerPrice = supplierCost + profit;
  const overBudget = customerPrice > 450000;
  const nights = startDay && endDay ? Math.max(0, endDay - startDay) : 0;
  const packedDays = Object.entries(days).filter(([, ids]) => ids.length > 2).map(([day]) => day);

  const activityById = (id: string) => activities.find(a => a.id === id)!;
  const toggleHotel = (id: string) => {
    setSelectedHotels(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 3 ? [...current, id] : current);
    markChanged();
  };
  const handleDate = (day: number) => {
    if (startDay === null || (startDay !== null && endDay !== null) || day <= startDay) { setStartDay(day); setEndDay(null); }
    else { setEndDay(day); }
    markChanged();
  };
  const handleSearch = () => {
    setSearchState('loading');
    window.setTimeout(() => setSearchState(search.trim().toLowerCase().includes('japan') ? 'ready' : 'empty'), 650);
  };
  const setTransfer = (id: string, mode: TransferMode) => { setTransfers({ ...transfers, [id]: mode }); markChanged(); };
  const dropActivity = (day: number, activityId: string) => {
    const next = Object.fromEntries(Object.entries(days).map(([key, ids]) => [Number(key), ids.filter(id => id !== activityId)])) as Record<number, string[]>;
    next[day] = [...next[day], activityId];
    setDays(next); markChanged();
  };
  const removeActivity = (activityId: string) => {
    setDays(Object.fromEntries(Object.entries(days).map(([key, ids]) => [Number(key), ids.filter(id => id !== activityId)])) as Record<number, string[]>);
    setRemovedActivities([...removedActivities, activityId]); markChanged();
  };
  const restoreActivity = (activityId: string) => {
    setDays({ ...days, 3: [...days[3], activityId] }); setRemovedActivities(removedActivities.filter(id => id !== activityId)); markChanged();
  };

  const screen = useMemo(() => {
    if (step === 0) return (
      <>
        <div className="work-heading"><div><span className="eyebrow">Step 01 · Destination</span><h1>Where are they trying<br />to get away from?</h1></div><p>Start with the feeling. We’ll shape the route around how Aarav and Meera want to spend their time.</p></div>
        <label className="destination-search"><span>⌖</span><input aria-label="Search destination" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Try a country, city, or feeling" /><button onClick={handleSearch} type="button">Explore <span>→</span></button></label>
        {searchState === 'loading' ? <div className="loading-state" role="status"><span /><p>Opening the atlas for <strong>{search}</strong>…</p></div> : searchState === 'empty' ? <div className="empty-state"><span>⌕</span><h2>No route found for “{search}”</h2><p>Try a broader place name. “Japan”, “Portugal”, or “mountains in October” will get us moving.</p><button onClick={() => { setSearch('Japan'); setSearchState('ready'); }}>Return to Japan</button></div> : (
          <>
            <div className="destination-layout"><article className="map-card"><div className="map-grid" /><div className="japan-label">JAPAN <span>35.6762° N</span></div><div className="route-line" />{cities.includes('Tokyo') && <div className="city tokyo"><i /><strong>Tokyo</strong><span>4 nights</span></div>}{cities.includes('Kyoto') && <div className="city kyoto"><i /><strong>Kyoto</strong><span>2 nights</span></div>}<span className="map-water">Pacific<br />Ocean</span><div className="city-controls">{['Tokyo','Kyoto'].map(city => <button key={city} onClick={() => { setCities(cities.includes(city) ? cities.filter(c => c !== city) : [...cities, city]); markChanged(); }}>{cities.includes(city) ? '−' : '+'} {city}</button>)}</div></article>
              <aside className="fit-card"><span className="eyebrow">Why this fits them</span><h2>A rhythm that rewards curiosity.</h2><p>Tokyo brings the energy they asked for, but the route makes room to exhale. Kyoto slows the last two days into gardens, early walks, and long dinners.</p><div className="fit-list"><span>◌ Autumn food season</span><span>◌ Easy rail connection</span><span>◌ Strong vegetarian options</span></div><div className="season-note"><span>☼</span><p><strong>October is a lovely in-between.</strong> Mild evenings, quieter temple paths, and the first hint of autumn colour.</p></div></aside></div>
            <div className="curated-row"><span className="eyebrow">Also considered</span>{['Portugal · coastal table','Bhutan · high valleys','Sri Lanka · tea country'].map(item => <button key={item} onClick={() => { setSearch(item.split(' · ')[0]); setSearchState('empty'); }}>{item}<span>↗</span></button>)}</div>
          </>
        )}
      </>
    );
    if (step === 1) return (
      <>
        <div className="work-heading"><div><span className="eyebrow">Step 02 · Dates</span><h1>Find the week with<br />room to breathe.</h1></div><p>Six nights is enough for contrast without turning every morning into a checkout.</p></div>
        <div className="date-summary"><div><span>Departure</span><strong>{startDay ? `${startDay} Oct 2026` : 'Choose date'}</strong></div><i>→</i><div><span>Return</span><strong>{endDay ? `${endDay} Oct 2026` : 'Choose date'}</strong></div><div className="night-count"><strong>{nights || '—'}</strong><span>Nights</span></div></div>
        <div className="calendar-wrap"><CalendarMonth month={9} year={2026} start={startDay} end={endDay} onDay={handleDate} /><CalendarMonth month={10} year={2026} start={null} end={null} onDay={() => {}} /></div>
        <div className="date-notes"><label className="toggle-row"><button className={flexible ? 'toggle on' : 'toggle'} onClick={() => { setFlexible(!flexible); markChanged(); }}><i /></button><span><strong>Flexible by 2 days</strong><small>Show the best-value window around these dates</small></span></label><div className="season-card"><span>◌</span><p><strong>Shoulder-season sweet spot</strong> Daytime temperatures usually feel mild; evenings ask for a light layer.</p></div><div className="availability-warning"><span>!</span><p><strong>One stay needs attention.</strong> Aoi Machiya is unavailable on 15 October. Your current shortlist is unaffected.</p></div></div>
      </>
    );
    if (step === 2) return (
      <>
        <div className="work-heading hotel-heading"><div><span className="eyebrow">Step 03 · Hotel</span><h1>Choose the stay that<br />sets the trip’s tempo.</h1></div><div className="compare-actions"><span>{selectedHotels.length}/3 shortlisted</span><button disabled={selectedHotels.length < 2} onClick={() => setCompare(!compare)}>{compare ? 'Back to stays' : 'Compare stays'}</button></div></div>
        {compare ? <div className="compare-table"><div className="compare-row compare-head"><span>Decision lens</span>{selectedHotels.map(id => { const h=hotelOptions.find(x=>x.id===id)!; return <strong key={id}>{h.name}<small>{h.tier}</small></strong>; })}</div>{[['Mood','mood'],['Location','distance'],['Room','room'],['Cancellation','cancel'],['Total impact','impact'],['Customer fit','tradeoff']].map(([label,key]) => <div className="compare-row" key={label}><span>{label}</span>{selectedHotels.map(id => { const h=hotelOptions.find(x=>x.id===id)!; return <p key={id}>{h[key as keyof typeof h] as string}</p>; })}</div>)}</div> : <div className="stays-grid">{hotelOptions.map(h => <HotelCard key={h.id} hotel={h} selected={selectedHotels.includes(h.id)} onSelect={() => toggleHotel(h.id)} />)}</div>}
        <div className="unavailable-stay"><span>Unavailable</span><div><strong>Aoi Machiya, Kyoto</strong><small>The garden suite is held by another agent for 15 October.</small></div><button onClick={() => showToast('Availability alert set for Aoi Machiya')}>Alert me if released</button></div>
      </>
    );
    if (step === 3) return (
      <>
        <div className="work-heading"><div><span className="eyebrow">Step 04 · Transfers</span><h1>Make the in-between<br />feel considered.</h1></div><p>Comfort is not always a bigger car. It is often one less decision after a long flight.</p></div>
        <div className="journey-line">{transferSegments.map((s,i) => <div key={s.id}><span>{s.icon}</span><strong>{s.from}</strong>{i < transferSegments.length && <i />}</div>)}<div><span>◎</span><strong>Kansai</strong></div></div>
        <div className="transfer-list">{transferSegments.map(segment => <article className="transfer-card" key={segment.id}><div className="transfer-title"><span>{segment.icon}</span><div><h3>{segment.from} <i>→</i> {segment.to}</h3><small>{segment.note}</small></div><em>{segment.fatigue}</em></div><div className="transfer-options">{(Object.keys(segment.choices) as TransferMode[]).map(mode => { const c=segment.choices[mode]; return <button className={transfers[segment.id]===mode ? 'active' : ''} key={mode} onClick={() => setTransfer(segment.id, mode)}><span>{c[0]}</span><strong>{formatMoney(Number(c[1]))}</strong><small>{c[2]}</small></button>; })}</div></article>)}</div>
        <div className="comfort-note"><div><span>Journey comfort</span><strong>{Object.values(transfers).filter(v => v !== 'shared').length >= 3 ? 'Very gentle' : 'Well balanced'}</strong></div><p>The private arrival transfer protects the first evening. The shared airport coach is a reasonable place to save.</p></div>
      </>
    );
    if (step === 4) return (
      <>
        <div className="work-heading"><div><span className="eyebrow">Step 05 · Activities</span><h1>Assemble a story,<br />not a schedule.</h1></div><p>Drag an experience into a new day. Leaving part of the trip unwritten is a deliberate choice.</p></div>
        {packedDays.length > 0 && <div className="packed-warning"><span>!</span><p><strong>Day {packedDays.join(', ')} is feeling crowded.</strong> Two anchor experiences is usually enough for this brief.</p></div>}
        <div className="itinerary-board">{[1,2,3,4,5,6].map(day => <section className="day-column" key={day} onDragOver={e => e.preventDefault()} onDrop={e => dropActivity(day, e.dataTransfer.getData('activity'))}><header><span>Day {day}</span><strong>{day <= 4 ? 'Tokyo' : 'Kyoto'}</strong><small>{11+day} Oct</small></header><div className="day-drop">{days[day].map(id => { const a=activityById(id); return <article className="activity-card" draggable key={id} onDragStart={e => e.dataTransfer.setData('activity', id)}><img src={a.image} alt="" /><div><span className="drag-handle">⋮⋮</span><h3>{a.title}</h3><p>{a.duration} · {a.neighbourhood}</p><div className="activity-meta"><span>{a.pace}</span><strong>{formatMoney(a.price)} / traveller</strong></div><details><summary>Why it belongs here</summary><p>{a.why}</p><small>{a.cancellation}</small></details><button aria-label={`Remove ${a.title}`} onClick={() => removeActivity(id)}>Remove</button></div></article>; })}{days[day].length === 0 && <div className="free-state"><span>☼</span><strong>Free afternoon</strong><p>Nothing to rush toward. Leave it open.</p></div>}</div></section>)}</div>
        {removedActivities.length > 0 && <div className="activity-library"><span className="eyebrow">Available experiences</span>{removedActivities.map(id => { const a=activityById(id); return <button key={id} onClick={() => restoreActivity(id)}>+ {a.title}<span>{formatMoney(a.price)} pp</span></button>; })}</div>}
      </>
    );
    if (step === 5) return (
      <>
        <div className="work-heading"><div><span className="eyebrow">Step 06 · Markup</span><h1>Price the care that<br />goes into the trip.</h1></div><p>Experiment freely. Nothing reaches the customer until the proposal is shared.</p></div>
        <div className="markup-layout"><section className="markup-control"><span className="eyebrow">Your margin</span><div className="percent-input"><input aria-label="Agent markup percentage" type="number" min="0" max="30" value={markup} onChange={e => { setMarkup(Math.max(0, Math.min(30, Number(e.target.value)))); markChanged(); }} /><span>%</span></div><input className="range" aria-label="Markup slider" type="range" min="0" max="25" step="0.5" value={markup} onChange={e => { setMarkup(Number(e.target.value)); markChanged(); }} /><div className="range-labels"><span>Lean</span><span>Protected</span><span>Premium</span></div><label className="amount-field"><span>Or set profit directly</span><div><input aria-label="Profit amount" value={profit} onChange={e => { const value=Number(e.target.value.replace(/\D/g,'')); setMarkup(Math.round(value/supplierCost*1000)/10); markChanged(); }} /><strong>INR</strong></div></label><div className="recommendation"><span>R&amp;R</span><p><strong>{markup >= 11 && markup <= 14 ? 'This sits in the right place.' : markup < 11 ? 'There is room to protect more of your work.' : 'The price is beginning to feel sensitive.'}</strong> {markup.toFixed(1)}% {markup >= 11 && markup <= 14 ? 'protects your margin while keeping the proposal within the stated budget.' : markup < 11 ? 'is lean for a bespoke six-night itinerary.' : 'moves the proposal toward the top of their stated range.'}</p></div></section>
          <section className="price-preview"><span className="eyebrow">Customer-price preview</span><strong className="preview-price">{formatMoney(customerPrice)}</strong><small>for two travellers · taxes included</small><div className={`budget-track ${overBudget ? 'over' : ''}`}><div style={{ width: `${Math.min(100, Math.max(10, (customerPrice-300000)/150000*100))}%` }} /><span>₹3.8L</span><span>Stated range</span><span>₹4.5L</span></div>{overBudget ? <p className="budget-status warning">Over budget by {formatMoney(customerPrice-450000)}</p> : <p className="budget-status">Within budget · {formatMoney(450000-customerPrice)} of headroom</p>}<div className="sensitivity"><div><span>Price sensitivity</span><strong>{customerPrice < 400000 ? 'Low' : customerPrice <= 450000 ? 'Moderate' : 'High'}</strong></div><p>A 1% change moves the customer price by {formatMoney(supplierCost/100)}.</p></div></section></div>
        <div className="cost-breakdown"><header><span>Transparent cost breakdown</span><strong>{formatMoney(customerPrice)}</strong></header>{[['Flights & core services',143000],['Selected stay',hotelCost],['Transfers',transferCost],['Activities',activityCost],['Agent profit',profit]].map(([label,value]) => <div key={String(label)}><span>{label}</span><i /><strong>{formatMoney(Number(value))}</strong></div>)}</div>
      </>
    );
    return (
      <>
        <div className="proposal-top"><div><span className="eyebrow">Step 07 · Customer proposal</span><h1>Ready to tell<br />the story.</h1></div><div className="view-toggle"><button className={proposalView==='desktop'?'active':''} onClick={() => setProposalView('desktop')}>Desktop</button><button className={proposalView==='mobile'?'active':''} onClick={() => setProposalView('mobile')}>WhatsApp</button></div></div>
        <div className={`proposal-stage ${proposalView}`}><article className="proposal-paper"><div className="proposal-cover"><img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=88" alt="A lantern-lit Kyoto street" /><div><span>Tokyo · Kyoto</span><h2>Japan, at an<br />unhurried pace</h2><p>12–18 October 2026 · Made for Aarav &amp; Meera</p></div></div><div className="proposal-intro"><span className="folio">01 / THE IDEA</span><p>Six nights between the city that keeps unfolding and the old capital that asks you to slow down. There will be remarkable meals. There will also be a free afternoon, because the best part of a trip sometimes starts after the plan ends.</p></div><div className="proposal-details"><section><span className="eyebrow">Your route</span><div className="proposal-route"><strong>Tokyo</strong><i /><strong>Kyoto</strong></div><p>4 nights · Shinkansen · 2 nights</p></section><section><span className="eyebrow">Your stay</span><h3>{activeHotel.name}</h3><p>{activeHotel.line}</p></section></div><div className="proposal-days"><span className="eyebrow">The days, lightly held</span>{Object.entries(days).map(([day,ids]) => <div key={day}><strong>Day {day}</strong><span>{ids.length ? ids.map(id=>activityById(id).title).join(' · ') : 'An afternoon left open'}</span></div>)}</div><div className="customer-price"><span>Your trip, for two</span><strong>{formatMoney(customerPrice)}</strong><small>Includes accommodation, transfers and listed experiences. Fictional pricing for prototype use.</small></div><div className="agent-note"><span>From your travel advisor</span><p>“I have kept the early Kyoto morning and the first Tokyo evening deliberately gentle. If you want one more food experience, I would add it on Day 3 rather than filling the open afternoon.”</p><strong>— Ananya Shah</strong></div></article></div>
        <div className="proposal-actions"><label><span>Optional note</span><input defaultValue="I shaped this around the slow, food-led week we spoke about." /></label><button className="whatsapp" onClick={() => showToast('Proposal link ready to share on WhatsApp')}>Share on WhatsApp ↗</button><button onClick={() => window.print()}>Download PDF ↓</button></div>
        <div className="privacy-note"><span>✓</span><p><strong>Customer-safe preview.</strong> Supplier costs, markup and expected profit are hidden from this proposal.</p></div>
      </>
    );
  }, [step, search, searchState, cities, startDay, endDay, flexible, selectedHotels, compare, transfers, days, removedActivities, markup, proposalView, nights, packedDays, activeHotel, hotelCost, transferCost, activityCost, supplierCost, profit, customerPrice, overBudget]);

  return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="#" onClick={e => { e.preventDefault(); goTo(0); }} aria-label="Route and Ritual home"><span className="brand-mark">R</span><span><strong>Route &amp; Ritual</strong><small>Travel atelier</small></span></a><div className="trip-meta"><span className="eyebrow">Designing for</span><strong>Aarav &amp; Meera</strong><span className="draft">Draft</span></div><div className="top-actions"><button className={`saved ${dirty ? 'unsaved' : ''}`} onClick={() => { setDirty(false); showToast('Draft saved'); }}><i /> {dirty ? 'Unsaved changes' : 'All changes saved'}</button><button className="share" onClick={() => goTo(6)}>Share proposal <span>↗</span></button><button className="avatar" aria-label="Agent profile">AS</button></div></header>
      <aside className="spine" aria-label="Journey steps"><p className="spine-label">Journey spine</p><nav>{steps.map(([label,icon],index) => <button className={`spine-step ${index===step?'active':''} ${index<step?'complete':''}`} key={label} onClick={() => goTo(index)}><span className="step-dot">{index<step?'✓':icon}</span><span><small>{String(index+1).padStart(2,'0')}</small>{label}</span></button>)}</nav><div className="brief-note"><span>Trip brief</span><p>Food, culture, and slow discovery.</p></div></aside>
      <section className={`workspace step-${step}`}>{screen}<footer className="work-footer"><button className="quiet-button" onClick={() => { setDirty(false); showToast('Draft saved'); }}>Save as draft</button>{step>0 && <button className="back-button" onClick={() => goTo(step-1)}>← Back</button>}<button className="continue-button" onClick={() => step<6 ? goTo(step+1) : showToast('Proposal ready to share')}>{step<6?`Continue to ${steps[step+1][0].toLowerCase()}`:'Finish proposal'} <span>→</span></button></footer></section>
      <button className="ledger-mobile-trigger" onClick={() => setLedgerOpen(!ledgerOpen)}><span>Trip total</span><strong>{formatMoney(customerPrice)}</strong><i>{ledgerOpen?'×':'⌃'}</i></button>
      <aside className={`ledger ${ledgerOpen?'open':''}`}><button className="ledger-close" onClick={() => setLedgerOpen(false)}>×</button><div className="ledger-title"><div><span className="eyebrow">Live estimate</span><h2>Trip Ledger</h2></div><span className="folio">№ 027</span></div><div className="ledger-route"><span>JPN</span><div><strong>{cities.length ? cities.join(' + ') : 'Japan'}</strong><small>{startDay || '—'}–{endDay || '—'} October 2026 · {nights || '—'} nights</small></div></div><div className="ledger-row"><span>Travellers</span><strong>2 adults</strong></div><div className="ledger-row"><span>Supplier cost</span><strong>{formatMoney(supplierCost)}</strong></div><div className="ledger-row"><span>Agent markup <em>{markup}%</em></span><strong>{formatMoney(profit)}</strong></div><div className={`ledger-total ${overBudget?'over':''}`}><span>Customer price</span><strong>{formatMoney(customerPrice)}</strong><small>{overBudget?'Above stated budget':'Within stated budget'}</small></div><div className="profit"><div><span>Expected profit</span><strong>{formatMoney(profit)}</strong></div><div className="margin-ring" style={{ background: `conic-gradient(var(--moss) 0 ${Math.min(100,markup*6.4)}%,rgba(98,116,84,.15) ${Math.min(100,markup*6.4)}%)` }}><span>{markup}%</span></div></div><div className="margin-health"><div><span>Margin health</span><strong>{markup<9?'Lean':markup>18?'Sensitive':'Healthy'}</strong></div><div>{[0,1,2,3,4].map(i => <i key={i} className={i < Math.ceil(markup/4) ? 'filled' : ''} />)}</div></div><div className="changed"><span className="eyebrow">What changed?</span><p><i /> {steps[step][0]} is open <small>Just now</small></p><p><i /> {activeHotel.name} leads the shortlist <small>Saved to package</small></p><p><i /> Markup set to {markup}% <small>{overBudget?'Budget needs attention':'Inside customer range'}</small></p></div><p className="ledger-foot">Costs update as you design. Supplier rates and all travel data are fictional for this prototype.</p></aside>
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
