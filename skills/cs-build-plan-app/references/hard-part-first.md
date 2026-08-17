# Find the hard part, and find who already solved it

## Every app has exactly one genuinely hard thing

The rest is screens, forms, lists and buttons — well-understood work that an AI agent does quickly and reliably. One part is not, and it decides whether the app is possible at the quality the person imagines.

**A plan that has not named the hard part is not a plan.** It is a wish with a feature list attached, and the build discovers the hard part in week three, which is the worst possible moment: after the screens are built around an assumption that turns out to be false.

### Finding it

Walk the journey from `elicitation.md` and ask at each step: *if I had to build only this, would I know how?*

The hard part is usually one of:

| Kind | Examples |
|---|---|
| **Real-time perception** | camera, pose, audio, video processing |
| **Getting data out of a mess** | receipts, PDFs, faxes, handwriting, scraping |
| **A domain rule nobody has written down** | tax logic, clinical scheduling, compliance |
| **Sync, offline-first, or multi-user state** | conflict resolution is always harder than it looks |
| **A content or data corpus that must exist** | see `v1-scope.md` — often the real cost, and it is not a coding problem at all |
| **An integration you do not control** | a system with no API, or a hostile one |

If you genuinely cannot find a hard part, the app is a CRUD app. Say so — that is **good news**, it means fast and cheap, and the person should hear it.

---

## Search for prior art before designing anything custom

Somebody has solved this. Use WebSearch/WebFetch and look, in this order:

1. **The platform's own framework.** The most overlooked answer and frequently the best one — no dependency, no licence question, better performance, maintained by the OS vendor, survives OS updates.
2. **A maintained cross-platform library** with real adoption and recent commits.
3. **An API** you can pay for — sometimes correct for v1, but check the per-user cost against the price of the app before committing.
4. **A research repo.** Usually the worst option: unmaintained, undocumented, and see the licence trap below.

Judge each candidate on: **licence**, **maintenance** (last commit, open issues), **platform fit**, **whether it runs locally or needs a server**, and **whether a non-expert can install it** — a dependency that needs Python, CUDA and a compiler is not viable for the audience these apps are built for.

---

## The licence trap — check it, every time

**The most googlable library in a field is very often the one that cannot be used commercially.** This kills projects late, after the app is built around it, and the person planning has no idea it is a risk.

Two patterns to recognise:

- **Academic / non-commercial licences.** Free to try, illegal to sell. The author will license commercially for a fee, sometimes a large one.
- **AGPL and other strong copyleft.** Legally usable, but the reciprocity obligations are usually incompatible with shipping a closed commercial app. Many popular ML repos are AGPL specifically to sell commercial exemptions.

**Permissive (MIT, Apache-2.0, BSD) is what you want**, and a platform-native framework has no licence question at all.

### Say the permissive part out loud — the fear is usually misplaced

Non-technical people hear "open source" and assume selling is forbidden, then rule out a perfectly good library. A real client asked *"can I really sell using Apache-2.0?"* and was about to reject the correct answer over it. Three sentences fix it, so say them:

| Licence | Can you sell a closed-source app with it? | What you must do |
|---|---|---|
| **MIT / BSD / Apache-2.0** | **Yes.** Commercial use and closed source are explicitly permitted | Include the licence text (an acknowledgements screen). Apache-2.0 also asks you to pass on any `NOTICE` file |
| **LGPL** | Usually, if dynamically linked | Get advice if you are static-linking |
| **GPL / AGPL** | **No**, not closed-source. AGPL extends this to network use | Buy a commercial exemption, or do not use it |
| **Non-commercial / academic** | **No**, at any price without a negotiated deal | Contact the owner; expect real money |
| **Platform framework** (Apple, Microsoft, Android) | **Yes** | Nothing — it is part of the OS |

**The distinction that matters is permissive vs copyleft vs non-commercial, not open vs closed.** Say which bucket the chosen library is in and what the obligation is, in one line, in the note. It removes a blocker that has nothing to do with engineering.

### Permissive still has obligations — make them a task

"You can sell it" is not "you can ignore it". Every permissive licence asks for something small, and because it is small it gets skipped and then discovered at launch. **Write it as a real task on the board**, not as a line in a note nobody opens:

- **Ship the licence text.** MIT, BSD and Apache-2.0 all require the copyright notice and licence text to travel with the distributed software. In an app that means an **Acknowledgements / Open Source Licences screen** — normally under Settings or About — listing each dependency, its copyright line and its full licence text.
- **Apache-2.0 additionally requires passing on any `NOTICE` file** the project ships, and flagging files you modified.
- **Keep a `LICENSES/` or `THIRD-PARTY-NOTICES` file in the repo** as the source of truth, generated from the dependency list rather than maintained by hand, so a new dependency cannot silently arrive without its notice.
- **Model weights can carry a different licence from the code that loads them.** Check both. A permissively-licensed inference library shipping restrictively-licensed weights is a real and easy trap.
- **Trademarks are not licensed by any of these.** You may use the code; you may not imply the project endorses your product.

None of this is onerous — it is one screen and one generated file — but it belongs in the plan, because the moment to add it is while the app is being built and not the week it ships.

### Worked example — human pose estimation

Real research done for a follow-along exercise app. **The two most searchable options were both unusable.**

| Option | Licence | Verdict |
|---|---|---|
| **Apple Vision** (`VNDetectHumanBodyPoseRequest`) | System framework, no separate licence | **Chosen.** On-device, no dependency, no install burden, ~19 joints, fast on Apple silicon |
| **MediaPipe / BlazePose** (Google) | Apache-2.0 | Good fallback. More landmarks, cross-platform, has a browser build |
| **MoveNet** (TensorFlow) | Apache-2.0 | Viable, very fast, fewer keypoints |
| **OpenPose** (CMU) | **Non-commercial / academic** | **Cannot ship.** Commercial licence costs real money |
| **Ultralytics YOLO-pose** | **AGPL-3.0** | **Cannot ship closed-source** without buying the commercial licence |

The lesson generalises: **the top two search results were the two that would have ended the project**, and the right answer was the platform framework nobody searches for because it is not a GitHub repo.

**Verify licences yourself at plan time.** The table above is a starting point and a demonstration of the risk, not a warranty — projects relicense, and a v1 answer can be wrong a year later.

---

## Make the hard part task #1

**The spike comes before any screen.** It is a throwaway whose only job is to answer *does this actually work, on real input, at the quality we need?*

A good spike:

- runs on **realistic input**, not the library's demo video — the actual camera, the actual lighting, the actual crumpled receipt, the actual 70-year-old partly out of frame
- measures the thing that matters — accuracy, latency, frame rate, error rate
- has a **written pass/fail threshold decided in advance**, so the result cannot be argued with afterwards
- is **thrown away**. It is not the foundation of the app.

Write it as the first task with the threshold in the description, e.g. *"Prove pose tracking holds 15fps and correctly identifies elbow angle within 15° on a MacBook webcam, standing 2m back, in a normally lit living room."*

**If the spike fails, the plan changes — and that is the spike doing its job**, cheaply, in week one, before the screens exist.

## Design a fallback before you need one

For anything perception- or AI-based, decide now what happens when it does not work: bad light, unusual body, occlusion, an old machine.

**There must be a path where the user still gets the outcome.** An exercise app whose camera cannot see the user should still run the session with a timer and a manual rep count. A receipt scanner that cannot read the total should ask.

The failure mode to design out is **the app confidently telling the user they are wrong when the app is the thing that is wrong** — that is the fastest way to lose trust permanently, and it is much worse than the app admitting it cannot see.

### Make the feedback signal progress, not judgement

The design move that removes this whole class of failure: **have the interface show how far through the action the user is, rather than whether they are doing it correctly.** Progress cannot be insulting when the sensor is wrong; a verdict can.

**Worked example.** An exercise app was going to draw the tracked skeleton **red until the movement was correct, then green**. Red means *you are doing this wrong* — and on a 78-year-old, partly out of frame, in a dim living room, the app would say it constantly while being wrong itself. The fix kept the identical visual and changed its meaning: neutral while tracking, filling toward green through the range of motion, green flash on a completed rep, **and never red**. Same satisfying feedback loop, structurally incapable of shaming the user.

**And when detection genuinely fails, the app blames itself in plain words** — *"I can't see you clearly, try stepping back"* — never the user. Pair this with the fallback path above so the user still gets the outcome.

### When the client is a licensed professional

If the person commissioning the app is a doctor, lawyer, accountant, therapist or similar, two rules apply and both belong in the notes:

1. **The app must not appear to give professional advice.** Anything that reads as a prescription, a dose, a load, a diagnosis or a legal position is a liability the software should not carry. Have the app *remember and display what the user did last time* instead of *recommending what they should do next*, and put any real guidance in the expert's own words, attributed to them.
2. **Expert review of the content is a required build step, not a formality.** They are the authority on every entry in the catalogue. Schedule it, name it as a task, and do not ship generated domain content they have not read.

---

## What good looks like

- The hard part is **named in one sentence** the person understands.
- Real prior art was **searched for**, with two or three candidates compared.
- The **licence of the chosen option was checked and recorded in the note.**
- The platform-native option was considered before any third-party dependency.
- The hard part is **task #1 as a spike with a written pass/fail threshold**.
- A **fallback path** exists for when it does not work.
