function _0x573f(_0x5a95c7, _0x54cbf0) {
  const _0x398d4f = _0x398d();
  return (
    (_0x573f = function (_0x573f37, _0x5543c7) {
      _0x573f37 = _0x573f37 - 0xfb;
      let _0x2c85ee = _0x398d4f[_0x573f37];
      return _0x2c85ee;
    }),
    _0x573f(_0x5a95c7, _0x54cbf0)
  );
}
const _0x495e26 = _0x573f;
(function (_0x312abe, _0x539206) {
  const _0x184050 = _0x573f,
    _0x397340 = _0x312abe();
  while (!![]) {
    try {
      const _0x305361 =
        (parseInt(_0x184050(0x114)) / 0x1) *
          (-parseInt(_0x184050(0xfb)) / 0x2) +
        (-parseInt(_0x184050(0x117)) / 0x3) *
          (parseInt(_0x184050(0xff)) / 0x4) +
        parseInt(_0x184050(0x11a)) / 0x5 +
        parseInt(_0x184050(0x112)) / 0x6 +
        (-parseInt(_0x184050(0x11b)) / 0x7) *
          (parseInt(_0x184050(0xfe)) / 0x8) +
        parseInt(_0x184050(0x115)) / 0x9 +
        parseInt(_0x184050(0x113)) / 0xa;
      if (_0x305361 === _0x539206) break;
      else _0x397340["push"](_0x397340["shift"]());
    } catch (_0x306147) {
      _0x397340["push"](_0x397340["shift"]());
    }
  }
})(_0x398d, 0xd8d8b);
const audio_music = document[_0x495e26(0x10f)](_0x495e26(0x100)),
  on_speaker = $(_0x495e26(0x105)),
  off_speaker = $(_0x495e26(0x10a));
let urlWedding = window[_0x495e26(0xfc)][_0x495e26(0x108)],
  chechMode = urlWedding[_0x495e26(0x119)]("iframeMode=true");
function _0x398d() {
  const _0xa8d7ab = [
    "show",
    "get",
    "2101776cMBsvG",
    "23867370loolyl",
    "5TpJjUJ",
    "1155321AQFbFK",
    "currentTime",
    "3LHiZcX",
    "search",
    "includes",
    "7551245UkefXU",
    "7174524zOVNcb",
    "327262THVOAB",
    "location",
    "then",
    "8vgIYSw",
    "6577444UrFzbU",
    "audio_music",
    "touchstart",
    "play",
    "hide",
    "paused",
    ".on_speaker",
    "click",
    "catch",
    "href",
    "pause",
    ".off_speaker",
    "load",
    "timeMusic",
    "error",
    "KhÃ´ng\x20thá»ƒ\x20phÃ¡t\x20nháº¡c:",
    "getElementById",
  ];
  _0x398d = function () {
    return _0xa8d7ab;
  };
  return _0x398d();
}
if (chechMode == ![]) {
  on_speaker["hide"](), off_speaker[_0x495e26(0x103)]();
  function checkSpeaker() {
    const _0x2c4a8b = _0x495e26;
    !audio_music[_0x2c4a8b(0x104)]
      ? (off_speaker[_0x2c4a8b(0x103)](), on_speaker["show"]())
      : (off_speaker[_0x2c4a8b(0x110)](), on_speaker["hide"]());
  }
  function runMusicMode() {
    const _0x2466ea = _0x495e26;
    $(window)["on"](_0x2466ea(0x10b), function () {
      const _0x251827 = _0x2466ea;
      _0x251827(0x10c) in window
        ? ((audio_music[_0x251827(0x116)] = timeMusic),
          audio_music[_0x251827(0x102)](),
          checkSpeaker())
        : (audio_music[_0x251827(0x102)](), checkSpeaker());
    });
    let _0x10461b = ![];
    $(window)["on"]("scroll", function () {
      const _0xa90336 = _0x2466ea;
      _0x10461b == ![] &&
        (_0xa90336(0x10c) in window
          ? ((audio_music[_0xa90336(0x116)] = timeMusic),
            audio_music[_0xa90336(0x102)](),
            (_0x10461b = !![]),
            checkSpeaker())
          : (audio_music[_0xa90336(0x102)](),
            (_0x10461b = !![]),
            checkSpeaker()));
    });
  }
  const paramsMusic = new URLSearchParams(
      window[_0x495e26(0xfc)][_0x495e26(0x118)]
    ),
    GetMusic = paramsMusic[_0x495e26(0x111)]("music");
  if (!GetMusic) {
    runMusicMode(), audio_music[_0x495e26(0x102)](), checkSpeaker();
    let roleTouch = ![];
    document["addEventListener"](
      _0x495e26(0x101),
      function (_0x2fb24b) {
        const _0xbbce9a = _0x495e26;
        roleTouch === ![] &&
          ("timeMusic" in window
            ? ((audio_music["currentTime"] = timeMusic),
              audio_music[_0xbbce9a(0x102)](),
              checkSpeaker())
            : (audio_music[_0xbbce9a(0x102)](), checkSpeaker())),
          (roleTouch = !![]);
      },
      ![]
    );
  }
  let checkCurrentMusic = ![];
  off_speaker[_0x495e26(0x106)](function () {
    const _0x5f1eb4 = _0x495e26;
    _0x5f1eb4(0x10c) in window
      ? checkCurrentMusic === ![]
        ? audio_music[_0x5f1eb4(0x102)]()
            [_0x5f1eb4(0xfd)](() => {
              const _0x504308 = _0x5f1eb4;
              audio_music[_0x504308(0x109)](),
                (audio_music["currentTime"] = timeMusic),
                audio_music["play"](),
                (checkCurrentMusic = !![]);
            })
            [_0x5f1eb4(0x107)]((_0x5883cf) => {
              const _0x2eb3e0 = _0x5f1eb4;
              console[_0x2eb3e0(0x10d)](_0x2eb3e0(0x10e), _0x5883cf);
            })
        : audio_music[_0x5f1eb4(0x102)]()
      : audio_music[_0x5f1eb4(0x102)](),
      checkSpeaker();
  }),
    on_speaker["click"](function () {
      const _0x859d52 = _0x495e26;
      audio_music[_0x859d52(0x109)](), checkSpeaker();
    });
} else audio_music[_0x495e26(0x109)]();
