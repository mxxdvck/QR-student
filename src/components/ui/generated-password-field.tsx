"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

type GeneratedPasswordFieldProps = {
  id: string;
  name?: string;
  label?: string;
};

const WORDS = [
  "cedar",
  "cloud",
  "copper",
  "field",
  "forest",
  "garden",
  "harbor",
  "linen",
  "maple",
  "mint",
  "north",
  "orbit",
  "quiet",
  "river",
  "signal",
  "silver",
  "stone",
  "summer",
  "winter",
];

export function GeneratedPasswordField({
  id,
  label = "Пароль",
  name = "password",
}: GeneratedPasswordFieldProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setPassword(generatePassword()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function copyPassword() {
    if (!password) {
      return;
    }

    await window.navigator.clipboard.writeText(password);
  }

  return (
    <div className="space-y-2">
      <Input
        id={id}
        name={name}
        label={label}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="text"
        minLength={12}
        pattern="[A-Za-z0-9-]+"
        autoComplete="new-password"
        spellCheck={false}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="secondary" onClick={() => setPassword(generatePassword())}>
          Сгенерировать
        </Button>
        <Button type="button" variant="secondary" onClick={copyPassword}>
          Скопировать
        </Button>
      </div>
      <p className="text-sm text-zinc-600">
        Передайте этот пароль пользователю. После сохранения посмотреть его будет нельзя.
      </p>
    </div>
  );
}

function generatePassword(): string {
  const wordCount = getRandomNumber(2) + 2;
  const words = Array.from({ length: wordCount }, () => WORDS[getRandomNumber(WORDS.length)]);
  const suffix = wordCount === 2 ? String(100 + getRandomNumber(900)) : String(10 + getRandomNumber(90));
  const password = [...words, suffix].join("-");

  return password.length >= 12 ? password : generatePassword();
}

function getRandomNumber(maxExclusive: number): number {
  const values = new Uint32Array(1);
  const range = 0x100000000;
  const limit = Math.floor(range / maxExclusive) * maxExclusive;

  do {
    window.crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % maxExclusive;
}
