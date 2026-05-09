"use client";

import {
  getYoolaManifestCollectionSchema,
  type YoolaSyncField,
} from "@/lib/yoola-external-project-manifest";

function toRecord(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return null;
  }
}

function formatFieldValue(value: unknown, field: YoolaSyncField) {
  if (field.type === "string-array") {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  if (field.type === "number") {
    return typeof value === "number" ? value.toString() : "";
  }

  if (field.type === "boolean") {
    return value === true;
  }

  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function parseFieldValue(value: string | boolean, field: YoolaSyncField) {
  if (field.type === "boolean") {
    return value === true;
  }

  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    return undefined;
  }

  if (field.type === "number") {
    const numeric = Number(text);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  if (field.type === "string-array") {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return text;
}

export function YoolaAdminSchemaFields({
  collectionSlug,
  onChange,
  profileDataText,
}: {
  collectionSlug: string;
  onChange: (nextProfileDataText: string) => void;
  profileDataText: string;
}) {
  const schema = getYoolaManifestCollectionSchema(collectionSlug);
  const profileData = toRecord(profileDataText);
  const fields: YoolaSyncField[] = [...(schema?.profileFields ?? [])];

  if (!schema || fields.length === 0 || !profileData) {
    return null;
  }

  const setField = (field: YoolaSyncField, value: string | boolean) => {
    const next = { ...profileData };
    const parsedValue = parseFieldValue(value, field);

    if (parsedValue === undefined) {
      delete next[field.key];
    } else {
      next[field.key] = parsedValue;
    }

    onChange(JSON.stringify(next, null, 2));
  };

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-white/10 pb-2">
        <div>
          <p className="text-xs font-bold text-white/54">Structured profile fields</p>
          <p className="mt-1 text-xs text-white/36">{schema.title}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label className="grid gap-2" key={field.key}>
            <span className="text-xs font-bold text-white/54">{field.label}</span>
            {field.type === "boolean" ? (
              <input
                checked={formatFieldValue(profileData[field.key], field) === true}
                className="h-5 w-5 accent-[#5eead4]"
                onChange={(event) => setField(field, event.target.checked)}
                type="checkbox"
              />
            ) : field.options?.length ? (
              <select
                className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5eead4]/50"
                onChange={(event) => setField(field, event.target.value)}
                value={String(formatFieldValue(profileData[field.key], field))}
              >
                <option className="bg-[#111115]" value="">
                  Unset
                </option>
                {field.options.map((option: string) => (
                  <option className="bg-[#111115]" key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/26 focus:border-[#5eead4]/50"
                onChange={(event) => setField(field, event.target.value)}
                type={field.type === "number" ? "number" : "text"}
                value={String(formatFieldValue(profileData[field.key], field))}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
