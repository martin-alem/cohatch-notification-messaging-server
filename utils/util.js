export function setCookie(res, key, value, expiration) {
  res.cookie(key, value, {
    expires: new Date(Date.now() + expiration * 3600000),
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    sameSite: "lax",
  });
}

export function uniqueCombination(str1, str2) {
  const strLen1 = str1.length;
  const strLen2 = str2.length;

  if (!strLen1 || !strLen2) throw new Error("str cannot be empty string");
  if (str1 === str2) throw new Error("str1 and str2 must be distinct strings");

  let counter1 = 0;
  let counter2 = 0;

  let uniqueString = "";

  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  while (counter1 < strLen1 && counter2 < strLen2) {
    const codePoint1 = str1.codePointAt(counter1++);
    const codePoint2 = str2.codePointAt(counter2++);
    const sumCodePoint = codePoint1 + codePoint2;
    const derivedCodePoint = sumCodePoint % 26;
    uniqueString += letters[derivedCodePoint];
  }

  if (counter1 < strLen1) {
    for (let i = counter1; i < strLen1; i++) {
      uniqueString += str1[i];
    }
  }

  if (counter2 < strLen2) {
    for (let i = counter2; i < strLen2; i++) {
      uniqueString += str2[i];
    }
  }

  return uniqueString;
}
